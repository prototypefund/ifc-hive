import mongoose from 'mongoose'
import { ID } from './crypto.js'
import files from './files.js'
import https from 'https'
import fs from 'fs'
import { join, dirname } from 'path'
import { X509Certificate } from 'crypto'
import axios from 'axios'
const { Schema } = mongoose


/*
 * Basic Registry Functionality
 */

var m = null                                    // the mongoose connection
var certID = null                               // the certificate serial number used for identification
var port = null
var agent = null                                // the shared https client configuration of this instance, used to talk to peers
var log = null                                  // the log service passed on register
var dir = null                                  // needed for pull
const host = process.env.REG_HOST               // the configured server, domain or IP
const hosts = {}                                // maps hostnames to the https clients used to talk to them
const certs = {}                                // maps certificate IDs to the https clients used to talk to the hosts with that certificate
const cluster = {}                              // maps maps certificate IDs to hostnames
const swarms = {}                               // the registry configuration, mapping registry IDs to lists of instance certificate IDs
const lastTransactions = {}                     // holds the last transaction in the registry, is always sent in every response


const headers = {'Accept-Version': '1', 'Content-Type': 'application/json'}
const htOptions = { keepAlive: true, maxSockets: 6 }

async function lastTransaction(rid, tid, tBuf=false) {
/* 
 * Always keep the last transactionID of each registry cached
 * both as Buffer for use in the backreferences of new transactions
 * as well as string in a content-last header to set it in response headers
 *
 * used to set and to retrieve the cache
 * to set the cache, set both tid and rBuf, since the transactionID should be available in both forms at every new transaction site
 */
  if(tid) return (lastTransactions[rid] = [{ 'content-last': tid }, tBuf ])[0]
  if(lastTransactions[rid]) return (tBuf === true ? lastTransactions[rid] : lastTransactions[rid][0])
  
  // should never happen in normal operation, only on strange restarts or reconnects
  // but sadly requires it to make this an async function
  const r = await m.model('L_'+rid, _Ledger).findOne({},'_id').sort({T:-1}).lean()
  //console.log('RELOAD LAST TRANSACTION',r)
  lastTransactions[rid] = [{ 'content-last': ID.string(r._id) }, r._id]
  return (tBuf === true ? lastTransactions[rid] : lastTransactions[rid][0])
}

async function getBackreferences(reg, a, b) {
/*
 * Each new transaction needs three backreferences, two dependent on the kind of transaction, and the last
 * you have to pass the filter for the backreferences you need
 * the sort is handled here for all cases we have
 */
  const Ledger =  m.model('L_'+reg, _Ledger)
  const r = await Promise.all([Ledger.findOne(a,'_id').sort({T:1}).lean(),
                               Ledger.findOne(b,'_id').sort({T: b.cfg ? -1 : 1}).lean()])
  const ref = r.map(e => e._id)
  const [ _, last ] = await lastTransaction(reg, null, true)
  ref[2] = last
  return [ Ledger, ref ]
}

async function matchLastTransaction(r) {
  /*
   * match the last transaction submitted by the current request from lead
   * and the one last transaction your own instance has
   * any mismatch is concerning
   */
  if(r.query) {
    const check = r.headers['content-last']
    //console.log('CHECK!!!!',check)

    // give it 3 tries to catch up on confirmations
    for(let i = 0; i<3; ++i) {
      const last = (await lastTransaction(r.params.rid))['content-last']
      // TODO: automatic pull when behind
      if( check !== last ) {
        const p = new Promise(function(){setTimeout(()=>{},1000)})
        await p
        continue
      }
      else return

      // maybe actively resync when just waiting doesn't work, for now just throw error
      throw `Registry ${r.params.rid} out of sync on ${certID}. Expected ${check}, found ${last}`
    }
  }
}

async function chain(ledger, document, version, refs, data={}, date=undefined) {
/*
 *  this function creates the confirmed transaction chain, this is what this whole thing is about
 */

  const entry = new ledger( { T: date || Date.now(), D: document, V: version, ref: refs, ...data } )
  entry._id = ID.hash(entry)
  await entry.save()
  return entry
}

function HTTPClient(peer, host) {
/*
 *  Create a http client for a peer, and update all the lookup structures to find it
 *  or return the cached client
 *  it's impossible to have a single certificate to refer to multiple hosts or replace a host
 *  but that's kind of the point of certificates, so that's ok
 */
  
  if(host && !cluster[peer]) cluster[peer] = host
  return certs[peer] || (certs[peer] = hosts[cluster[peer]] =

                         axios.create({ baseURL: 'https://' + cluster[peer]+':'+port,
                                        headers: headers,
                                        httpsAgent: new https.Agent(htOptions) }))
}

function reconfigure(reg, new_cfg) {
/*
 * Updates the local lookup tables and peer http clients with a new config
 */
  const usepeers = []
  for(const n of new_cfg) {
    usepeers.push(n._id)
    HTTPClient(n._id, n.host)
  }
  return swarms[reg] = usepeers
}

async function confirm(req, transaction, peers=true) {

/*
 * confirmations distribute the data and transactions over the swarm for redundancy
 * and each peer independently rechecks each transaction it receives for reliability
 *
 * there are two basic strategies for confirmation
 * - telegraph and daisy chain through all peers one by one, each peer sending the transaction to the next
 *   this puts less strain on the lead instance, and gives faster responses there, but it takes longer for each transaction to reach the whole swarm
 *   it is possible to redefine the order in which the peers should confirm for each transaction
 * - broadcast and send it to all peers at once
 *   this puts a much greater strain on the lead instance, but also makes sure the whole swarm is in consensus fast
 *   this is especially important for swarm reconfiguration
 * 
 * it is possible to combine the two strategies: first telegraph through a list of one or more peers, and the broadcast to the rest
 * this puts load off the lead instance, and still reaches swarm consensus relatively fast
 * the default for signing and configuration transactions is broadcast
 * the default for upload is confirm with first, then broadcast
 * but those defaults can be changed with the "confirm" header, except for config transactions
 * this is just a space separated list of the peer IDs in the order the confirmations should be done
 * if any peers are left in the configuration after that, they are broadcasted to
 * sending a '*' as the confirm header value forces a broadcast
 * 
 * if peers is falsy, the first one in the swarm of the registry that is not yourself is used
 * if it is set to true, all peers in the swarm (except yourself) are used
 * if it is a list of strings, those strings represent certificate ids, the confirmations happen chained in that order, 
 * when there are no peers outside the lead instance, no confirmation happens
 * confirmation is run asyncronely after the reply is sent from the lead instance
 * as the confirmations run in, the confirmations field gets updated
 *
 * a special case is when a new swarm configuration needs to be confirmed: it means all old and new peers need to be notified
 * but only the confirmations of the new peers matters
 *
 * when a date is given, this means this is the follow-up confirmation of swarm config update
 * which means only the swarm and cluster caches will be updated and no new confirmation requests will happen
 *
 * can be understood as a push
 */

  const url = req.url
  //console.log(['CONFIRM?',req,peers])
  const reg = req.reg || url.split('/')[1].substr(0,52)    // registry from url or, on creation, passed on as an option
  delete req.reg

  const data = req.data
  const oldpeers = swarms[reg] || []

  var usepeers = []
  if(req.data?.cfg) {
    usepeers = reconfigure(reg, req.data.cfg)

    // if this is a config confirmation request on a peer, just update the swarm/cluster config
    if(!peers) return           
  }

  if(peers === true) usepeers = [...new Set([...usepeers, ...oldpeers])]
  else if(peers === false) usepeers = []
  else usepeers = peers

  for(let p of usepeers) {
    if(p === certID) continue
    const ht = HTTPClient(p)
    const r = {...req }
    if(r.method === 'PUT') r.data = fs.createReadStream(data)

    ht.request(r).then(function(res){
      const i = swarms[reg]?.indexOf(p)
      if(!i) return log.info(`Removed peer ${p} from registry ${reg}`)

      const id = ID.buffer(transaction)
      const d = Date.now()
      const Ledger = m.model('L_'+reg, _Ledger)
      const u = {}
      u['confirmations.'+(i-1)] = d;
      
      // what should be done when a confirmation fails?
      // easiest thing to do is, when a 'conflicts' entry exists in a transaction
      // then every new transaction is rejected with error message
      if(res.data !== transaction) {
        u['conflicts.'+(i-1)] = ID.buffer(res.data)
        lastTransactions[reg]['content-conflict'] = res.data
        log.error(`Confirmation mismatch from ${p}: ${res.data} != ${transaction}`)
      }
      else log.info(`Confirmed from ${p}: ${transaction}`)

      Ledger.findByIdAndUpdate( id , u).exec()                                // write confirmation into own transaction
      ht.post(`/!/${reg}/${res.data}?${d}`, '').then((r)=>{}).catch((e)=>{})    // send accepted confirmation to peer, if it fails, it fails
    }).catch( function(e) { console.log('REJECTED!', e.request.path, e.response.status, e.response.data) })
  }
  // no error handling in those requests: if an error occurs, it just stays unconfirmed
}

async function sync(regs) {
/*
 * bring the instance up to to the latest stage for the given registries
 * tries first with the last known lead instance
 * if that can't be reached, try to find the leads from the other configured instances
 * if no known instances for a registry can be reached, give up
 *
 * can be understodd as a pull
 */

  const res = (await regs).map(e => e._id)
  for(let r of res) {
    const reg = ID.string(r)
    const Ledger = m.model('L_'+reg, _Ledger)
    const transactions = await Ledger.find({},'_id').sort({T:1}).exec()
    const cfg = await Ledger.findOne({ cfg: { $exists: true }}).sort({T:-1}).exec()
    var ht = null
    for(let s of cfg.cfg) {

      let h = HTTPClient(s._id, s.host)
      if(!ht) {
        try {
          ht = h
          const lead = await ht.get('/'+reg)
          const last = ID.string(transactions.slice(-1)[0]._id)
          
          // if last transactions in lead and self are the same, we are in sync
          if(lead.data.transactions.slice(-1)[0] === last)
            continue

          // since lead is lead, it can be longer, but never shorter than self, and the order is always the same
          // so if the local last transaction is the same as the same position in lead, we are just out of sync
          if(lead.data.transactions[transactions.length-1] === last) {
            // sync
            const to_pull = lead.data.transactions.slice(transactions.length)
            console.log('TO PULL', to_pull)
            
            const pulled = await ht.get(`/-/${reg}/${to_pull[0]}`)
            const reconfigured = pulled.filter(e => e.cfg ).slice(-1)[0]
            if(reconfigured) reconfigure(reconfigured) 
            Ledger.insertMany(pulled)
            const files = pulled.filter(f => !(f.key||f.signature||f.cfg))
            pull(reconfigured?.cfg || cfg.cfg , files)
          }
        } catch(e) { continue }
          
        // if we get here, we have corruption, and need to sound alarm to maybe later clean it up manually
        
        /*
        const self = transactions.map(e => ID.string(e._id))
        console.log('LEAD: ', lead.data.transactions)
        console.log('SELF: ', self)
        const diff = lead.data.transactions.filter( e => self.indexOf(e) < 0)
        console.log('DIFF: ', diff)
        */
      }
    }
  }
}

async function pull(reg, cfg, files) {
/*
 * Pull all the files in the list from one of the peers that has it already.
 * At least the lead must already have it, but others are preferred, for load balancing
 * In general, try to balance the load over all peers in cfg.
 * Being busy with pulling doesn't prevent new requests coming in, it's just a performance issue.
 */

  const lead = HTTPClient(cfg[0]._id)                   // the lead instance of the swarm, should only be used as a backup
  const ht = cfg.slice(1).map(e => HTTPClient(e._id))   // the clients to talk to the non-lead peers in this swarm

  var i = 0
  for(f of files) {
    const path = join(dir,reg,f.D,f.V)
    
    // it is possible for files to already exist locally, from a failed transaction or a previous version, if it is, we are done
    // it may be pussible that the file name and it's hash don't match due to some transmission error or something
    // but that should be caught by regular active registry verification
    if(fs.existsSync(path)) continue

    // cycle through the peers to get each file, but make sure that peer has that file, use lead as fallback
    const client_index = f.confirmations[i%confirmations.length] ? i : f.confirmations.findIndex(e => !!e)
    const client = client_index >= 0 ? ht[client_index] : lead
    ++i

    // loads one file after another, if that becomes a bottleneck, we could use Promise.all here
    const writer = createWriteStream(path)
    const r = await client.get(join(reg,f.D,f.V),{responseType: 'stream'}).then( res => {
      return new Promise((solve, rej) => {
        res.data.pipe(writer)
        let error = null
        writer.on('error', err => { error = err; writer.close(); reject(err) })
        writer.on('close', () => { if(!error) solve(true) })
      })
    })
  }
}

const _Registry = new Schema({
/* 
 * holds the metadata for all registries
 * when a registry is created for a new project it gets an _id
 * and two new collections are created, the documents in both are immutable
 *  - F_id (Files) - holds the exported and imported files of the project
 *  - L_id (Ledger) - holds the project history and workflow data
 */
  
  _id: { type: Buffer, required: true, transform: ID.string },   // generated identifier of the registry, never changes, even if data changes
  T: { type: Date, required: true },                             // creation time, can't be an auto-generated timestamp because of mirroring
  name: { type: String, required: true },                        // user readable name of the registry, used in lists
  description:  { type: String, required: true },                // a more comprehensive description of the registry, can use markup
}, { timestamps: true })                                         // needs normal timestamps still, because registries can be mirrored at different times

const _Ledger = new Schema({
/* each registry creates a Ledger collection named after the registry _id */
/* the _id of entries is always the hash of the entry data */
  
  _id: { type: Buffer, required: true, transform: ID.string },        // generated identifier of the registry
  T: { type: Date, required: true },

  D: { type: Buffer, required: true, transform: ID.string, index: true },
  /*
   * the initial document hash, i.e. the first version, root
   * the registry key/id for the first entry
   * or the hash of the document the entry refers to
   */

  V: { type: Buffer, required: true, transform: ID.string, index: true },
  /*
   * the version hash, is the same as D for the first version
   * in config entries this is the registry ID
   */
  
  ref: { type: [Buffer], required: true, index: true, transform: function (a) { return a.map(e => ID.string(e) ) } },
  /*
   * the three backlink references to entries that establish history, consensus and consistency, always ledger entry IDs
   * for the first entry, all are the registry key/id
   * for new document commits, this is [1st,1st,last] (can all be the first for the first document)
   * for config commits, this is [1st,previous cfg||1st, last]
   * for document change commits, this is [ root, previous||root, last]
   * for a signature request, this is [root, version, last]
   * for a signature, [signature request, version, last ]
   */

  key: { type: String, required: false },                           // the public key that needs to sign
  signature: { type: String, required: false },                     // the signature fulfilling a signature request
  cfg: { type: [{ _id: String, host: String }], required: false, default: undefined },  // the registry cluster config is stored directly in the transaction
  name: { type: String, required: false },                          // filename
  mime: { type: String, required: false },                          // mime type

  // the list of instance servers that have confirmed this entry
  // the indexes in the list correspond to the list of instances in the last config entry
  // excluding the first/lead instance of course
  confirmations: { type: [Date] },
  // if a confirmation fails, the hash of the conflicting transaction is stored here the same way as the confirmation date
  // with this the conflicting transaction can be looked up and examined at the conflicting peer
  conflicts: { type: [Buffer] }

}, { timestamps: true })


export default function registry(a, opt, done) {

  dir = a.dir
  log = a.log
  port = opt.port
  certID = (new X509Certificate(a.server.cert).serialNumber)
  htOptions.cert = a.server.cert, htOptions.key = a.server.key, htOptions.ca = a.server.ca,

  mongoose.connect(opt.mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  m = mongoose.connection
  m.on('error', console.error.bind(console, 'mongo connection error:'))
  m.once('open', () => { a.log.info('Mongodb connected') })

  a.addHook('onResponse', (req, res, done) => { if(!res.headers['content-type']) res.header('content-type','application/json'); done() })  
  a.register(files, { db: mongoose, ledger: _Ledger, 
                      chain: chain, confirm: confirm,
                      lastTransaction: lastTransaction, getBackreferences: getBackreferences, matchLastTransaction: matchLastTransaction })
  
  const Registry  = m.model('ifc_registry', _Registry)

  const RegistryConfigSchema = { type: 'object', properties: {
    name: { type: 'string' }, description:  { type: 'string' },
    cfg: { type: 'array', minItems: 1, items: { type: 'object', properties: { _id: 'string', host: 'string' }}}
  }}

  sync(Registry.find({},'_id').exec())
  
  a.post('/', { body: { required: ['name','description', 'cfg'], ...RegistryConfigSchema }, query: 'number' }, async function(req, res) {
  /*
   *  Create a new Registry
   *  Each registry is a new access domain containing at least one project (each project being a separate history chain starting from the registry)
   *  Registries cannot be deleted or edited, that's the whole point: it can only be added to.
   *  The registry instance this request is invoked on automatically becomes the first instance of the registry, and as such the configured lead
   *  additional instances can be passed right away, or can be added later,
   *  but all projects in the same registry will have the same instance/peer configuration and all peers will receive all data
   *  any instance can create new registries, or do any write operation, but no other instance else will agree with them,
   *  and without a working ifc-hive application server, it will be useless
   */

    try {
      if(!req.query) req.body.cfg = [{ host: host, _id: certID }].concat(req.body.cfg)

      const r = new Registry( { T: req.query || Date.now(), ...{ name: req.body.name, description: req.body.description } } )
      r._id = ID.hash(r)
      r.save()

      const id = ID.string(r._id)
      // root entry into chain
      const entry = await chain(m.model('L_'+id, _Ledger), r._id, r._id, [r._id, r._id, r._id], { cfg: req.body.cfg }, r.T.valueOf())
      const tid = ID.string(entry._id)
      res.headers({'content-id': id, 'etag': id, ...await lastTransaction(id, tid, entry._id)})
      res.code(200).send('"'+tid+'"')

      confirm({ url: '/?'+r.T.valueOf(), method: 'POST', data: req.body, reg: id }, tid, !!!req.query)

    } catch(e) { res.code(500).send(e) }
  })


  a.get('/', async function(req, res) {
  /*
   *  List all Registry IDs in an Array
   */
    try {
      const r = await Registry.find({})
      res.header('content-id', process.env.REG_INSTANCE)
      res.code(200).send(r.map(e => ID.string(e._id)))
    }catch(e) { res.code(500).send(e) }
  })

  a.post('/:rid', { body: RegistryConfigSchema }, async function(req, res) {
  /*
   *  Reconfigure Registry
   *  Takes a new list of instances, each with the host and the certificate serial number as ID
   *  A new configuration must be confirmed by all new instances before it is accepted
   *  a new configuration also requires a refresh of the local configuration cache
   */

    try {
      await matchLastTransaction(req)
      if(!req.query)  req.body.cfg = [{ host: host, _id: certID }].concat(req.body.cfg)
      
      // get root entry and last cfg entry, can be the same on first reconfiguration
      const [ Ledger, refs ] = await getBackreferences(req.params.rid, {}, { cfg: { $exists: true }})
      const rid = ID.buffer(req.params.rid)
      const entry = await chain(Ledger, rid, refs[1], refs, { cfg: req.body.cfg }, req.query)
      const tid = ID.string(entry._id)
      res.headers({'content-id': req.params.rid, 'etag': tid, ...await lastTransaction(req.params.rid, tid)})
      res.code(200).send('"'+tid+'"')
      confirm({ url: req.url+'?'+entry.T.valueOf(), method: 'POST', data: req.body }, tid, !!!req.query)
    } catch(e) { res.code(500).send(e) }

  })

  /*
   *  Delete an instance in the Registry, at least one must be remaining active
   *  the cid is the hash of the certificate
   */
  
  a.head('/:rid', async function(req, res) {
  /*
   * check for registry, used to determine whether a registry is online on the instance to find confirmation/replication partners
   */

    try {
      const r = await Registry.findById(ID.buffer(req.params.rid)).exec()
      if(r) res.headers({'content-id': req.params.rid, 'etag': req.params.rid, ...await lastTransaction(req.params.rid)})
      res.code(200).send()
    } catch(e) { res.code( 500).send(e) }
    
  })

  a.get('/:rid', async function(req, res) {
  /*
   * return metadata, configuration and transaction list of the registry
   */
    try {
      const Ledger = m.model('L_'+req.params.rid, _Ledger)
      const a = await Promise.all([
        Registry.findById(ID.buffer(req.params.rid)).exec(),
        Ledger.findOne({ cfg: { $exists: true }}).sort({T:-1}).exec(),
        Ledger.find({},'_id').sort({T:1}).exec()
      ])
      
      if(!a[0]) return res.code(404).send()
      res.headers({'content-id': req.params.rid, 'etag': req.params.rid, ...await lastTransaction(req.params.rid)})
      const { T, name, description } = a[0]._doc
      const d = { T, name, description, cfg: a[1].cfg, transactions: a[2].map(e => ID.string(e._id)) }
      res.code(200).send(d)
    } catch(e) { res.code( 500).send(e) }
  })

  a.get('/:rid/', async function(req, res) {
  /*
   * return the ledger of the registry, by default the last version of each document and any connected signatures
   * the returned data can be specified in more detail by query parameters
   */
    try {
      const l = m.model('L_'+req.params.rid, _Ledger)
      const r = await l.find({},'T D V ref cfg name mime key signature confirmations').exec()
      if(r.length) res.headers({'content-id': req.params.rid, ...await lastTransaction(req.params.rid)})
      res.code( r ? 200 : 404).send(r)
    } catch(e) { console.log(e); res.code(500).send(e) }
  })
  
  a.get('/:rid/:did/:hash/:tid', async function (req, res) {
  /*
   * return a Ledger entry/transaction for the specfic document version
   * TODO: not properly implemented yet
   */
    try {
      const Ledger = m.model('L_'+req.params.rid, _Ledger)
      const r = Ledger.findById(ID.buffer(req.params.tid)).exec()
      if(r) res.headers({'content-id': req.params.did, 'etag': req.params.hash, ...await lastTransaction(req.params.rid)})
      res.code( r ? 200 : 404).send(r)
    } catch (e) { res.code(500).send(e) }
  })

  a.post('/:rid/:did/:hash', async function(req, res) {
  /*
   * Add a signature request or a signature for the document
   * and the same as with adding files, when a date query string is passed, it actually is a check
   */
    try {
      await matchLastTransaction(req)
      const content_last = lastTransactions[req.params.rid][0]
      const id = ID.buffer(req.params.hash)
      const did = ID.buffer(req.params.did)
      const [ Ledger, refs ] = await getBackreferences(
        req.params.rid, req.body.signature ?
          { V: id, key: req.body.key } :                                     // referenced signature request entry for signatures
          { V: did, key: { $exists: false}, signature: { $exists: false}},   // or document root to sign commit entry for signature requests
        { V: id, key: { $exists: false}, signature: { $exists: false}})      // document version to sign commit entry for both

      const entry = await chain(Ledger, did, id, refs, req.body.signature ? {signature: req.body.signature} : req.body, req.query || Date.now() )
      const tid = ID.string(entry._id)
      res.headers({'content-id': ID.string(entry.D), 'etag': tid, ...await lastTransaction(req.params.rid, tid, entry._id)})
      res.code(200).send('"'+tid+'"')
      confirm({ url: req.url+'?'+entry.T.valueOf(), method: 'POST', data: req.body, headers: content_last }, tid, !!!req.query)
    } catch(e) {  console.log(e); res.code( typeof e === 'string' ? 409 : 500).send(e) }
  })

  a.get('/-/:rid/:tid', async function (req, res) {
 /*
  * Send a bundle of all transactions in rid xfrom tid to the last one
  * this is used to resync a peer that has been offline
  * not a lot of data is sent, since only the transactions thenselves are sent
  * the files can then be pulled lazily,
  * because hashes and the peers that have the files are logged in the transactions
  */

    try {
      const Ledger = m.model("L_" + req.params.rid, _Ledger)
      const r0 = await Ledger.findById(ID.buffer(req.params.tid),'T').lean()
      const r = await Ledger.find({T: { $gte: r0.T }}, 'T D V ref key signature confirmations conflicts cfg').lean()
      res.code(200).send(r)
    } catch(e) { res.code(500).send(e) }
    

  })


  
  //a.post('/!/:rid', async function() {
  /*
   * check the integrity of a registry
   */

  //})
  
  
  a.post('/:rid/search', async function (req, res) {
    try {
      const Ledger = m.model("L_" + req.params.rid, _Ledger)
      req.body.hash = ID.buffer(req.body.hash)
      console.log(req.body)
      const r0 = await Ledger.findOne(req.body).exec()
      const r1 = await Ledger.findOne().sort({T:-1}).exec()
      res.code(200).send([r0,r1])
    } catch(e) { res.code(500).send(e) }
  })

  a.get('/-', async function (req, res) {
    const collections = await m.db.collections()
    for (let c of collections) console.log(c.namespace)
    res.code(200).send([certID, host])
  })

  a.post('/!/:rid/:tid' ,async function (req, res) {
  /*
   * confirmation ack
   * just an empty post with register and transaction in the URL
   * if this is the initial ack coming from lead, send the acks to all other members of the swarm
   */

    if(!req.query) return res.code(400).send('Date Missing.')

    const peer = res.request.socket.getPeerCertificate().serialNumber

    // own swarm index if request comes from lead, peer swarm index otherwise
    const i = swarms[req.params.rid]?.indexOf(peer) || swarms[req.params.rid]?.indexOf(certID)  
    //if(peer != ) return res.code(403).send(`${peer} is not ${req.params.rid} swarm lead.`)

    if(!i) return res.code(403).send(`Instance no member of swarm ${req.params.rid}.`)
    
    const Ledger = m.model('L_'+req.params.rid, _Ledger)
    const id = ID.buffer(req.params.tid)

    const u = {}
    u["confirmations."+(i-1)] = req.query
    Ledger.findByIdAndUpdate( id , u, { returnDocument: 'after' } ,
                              function (e,n) { /*console.log(['ACK', e || n])*/ } )
    res.code(200).send()

    // send acks to swarm if needed
    //if(peer === swarms[req.params.rid][0]) for(let p of swarms[req.params.rid].slice(1))
    //  if(p !== certID) ht.post('https://'+cluster[p] + req.url + '?' + req.query, '')

  })
  
  a.delete('/', async function (req, res) {
  /*
   * Delete everything in the Registry, leave application data in the DB alone
   * used to cleanup tests
   */

    try {
      const r = await Registry.deleteMany()
      const collections = await m.db.collections()
      const fc = collections.filter( e => e.s.namespace.collection[1] == '_')
      for (let c of fc) { const r = await c.drop(); }
      fs.rm(a.dir,{recursive: true}, e => {})
      res.code(200).send()
    } catch(e) { res.code(500).send(e) }
  })
  done() 
}
