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
var agent = null                                // the shared https client configuration of this instance, used to talk to peers
var ht = null                                   // the axios instance to use for sending requests to peers
var log = null                                  // the log service passed on register
const host = process.env.REG_HOST               // the configured server, domain or IP
const cluster = {}                              // the cluster configuration, mapping instance certificate IDs to hosts
const swarms = {}                               // the registry configuration, mapping registry IDs to lists of instance certificate IDs


const headers = {'Accept-Version': '1', 'Content-Type': 'application/json'}

async function chain(ledger, document, version, refs, data={}, date=undefined) {
/*
 *  this function creates the confirmed transaction chain, this is what this whole thing is about
 */

  const entry = new ledger( { T: date || Date.now(), D: document, V: version, ref: refs, ...data } )
  entry._id = ID.hash(entry)
  await entry.save()
  return entry
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
  console.log(['CONFIRM?',req,peers])
  const reg = req.reg || url.split('/')[1]    // registry from url or, on creation, passed on as an option
  delete req.reg

  const data = req.data
  const oldpeers = swarms[reg] || []

  var usepeers = []
  if(req.data?.cfg) { // new or changed swarm configuration
    for(const n of req.data.cfg) {
      usepeers.push(n._id)
      if(n._id in cluster) continue
      else cluster[n._id] = n.host
    }
    swarms[reg] = usepeers
    if(!peers) return  // if this is a config confirmation request on a peer, just update the swarm/cluster config
  }
  if(peers === true) usepeers = [...new Set([...usepeers, ...oldpeers])]
  else if(peers === false) usepeers = []
  else usepeers = peers

  console.log(['PEERS',req.url,usepeers])
  
  for(let p of usepeers) {
    if(p === certID) continue
    req.url = 'https://'+cluster[p]+':3000' + url
    if(req.method === 'PUT') req.data = fs.createReadStream(data)

    ht.request(req).then(function(res){

      const instance = res.request.socket.getPeerCertificate().serialNumber
      
      // what should be done when a confirmation fails?
      if(res.data !== transaction) return log.error(`Confirmation mismatch from ${instance}: ${res.data} != ${transaction}`)
      else log.info(`Confirmed from ${instance}: ${res.data} == ${transaction}`)

      const i = swarms[reg]?.indexOf(instance)

      if(!i) return log.info(`Removed peer ${instance} from register ${reg}`)

      const id = ID.buffer(transaction)
      const d = Date.now()
      const Ledger = m.model('L_'+reg, _Ledger)
      const u = {}
      u["confirmations."+(i-1)] = d;
      
      // write confirmation into own transaction
      Ledger.findByIdAndUpdate( id , u)
      const transaction_ack_url = `https://${cluster[p]}:3000/!/${reg}/${transaction}?${d}`
      ht.post(transaction_ack_url, '' ).then(()=>{})       // send accepted confirmation to peer, if it fails, it fails
    })
  }
  // no error handling in those requests: if an error occurs, it just stays unconfirmed
}

async function sync() {
/*
 * bring the instance up to to the latest stage for the given registries
 * tries first with the last known lead instance
 * if that can't be reached, try to find the leads from the other configured instances
 * if no known instances for a registry can be reached, give up
 *
 * can be understodd as a pull
 */
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
  confirmations: { type: [Date] }                                   
  
}, { timestamps: true })


export default function registry(a, opt, done) {

  certID = (new X509Certificate(a.server.cert).serialNumber)

  agent = new https.Agent({
    cert: a.server.cert,
    key: a.server.key,
    ca: a.server.ca,
  })
  
  ht = axios.create({ port: 3000, headers: headers, httpsAgent: agent })
  
  /* 
   * connect to mongodb @TODO make host and database dynamic with env variables 
   * add connection to server
   * the registry uses same mongodb as the application server, if there is an application server
   * it just uses different collections
   */
  mongoose.connect(a.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  m = mongoose.connection
  
  // add mongoose event handlers
  m.on('error', console.error.bind(console, 'mongo connection error:'))
  m.once('open', () => { a.log.info('Mongodb connected') })

  log = a.log
  
  a.register(files, { db: mongoose, ledger: _Ledger, chain: chain, confirm: confirm })

  const Registry  = m.model('ifc_registry', _Registry)

  a.addHook('onResponse', (req, res, done) => { if(!res.headers['content-type']) res.header('content-type','application/json'); done() })

  // load all registry configurations


  const RegistryConfigSchema = { type: 'object', properties: {
    name: { type: 'string' }, description:  { type: 'string' },
    cfg: { type: 'array', minItems: 1, items: { type: 'object', properties: { _id: 'string', host: 'string' }}}
  }}

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
      res.headers({'content-id': id, 'etag': id})
      res.code(200).send('"'+tid+'"')

      confirm({ url: '/?'+r.T.valueOf(), method: 'POST', data: req.body, reg: id }, tid, !!!req.query)

    } catch(e) { res.code(500).send(e) }
  })

  /*
   *  List all Registry Names in an Array
   */

  a.get('/', async function(req, res) {
    const r = await Registry.find({})
    //res.header('etag', process.env.REG_INSTANCE || '??')
    res.header('content-id', process.env.REG_INSTANCE || '??')
    res.code(200).send(r.map(e => ID.string(e._id)))
  })

  /*
   * server health check, the etag is the server ID key, which must be unique over all servers
   */
  /*a.head('/', async function(req, res) {
    res.header('etag', process.env.REG_INSTANCE || '??')
    res.code(200).send()
  })*/
  
  
  a.post('/:rid', { body: RegistryConfigSchema }, async function(req, res) {
  /*
   *  Reconfigure Registry
   *  Takes a new list of instances, each with the host and the certificate serial number as ID
   *  A new configuration must be confirmed by all new instances before it is accepted
   *  a new configuration also requires a refresh of the local configuration cache
   */

    try {

      const Ledger = m.model('L_'+req.params.rid, _Ledger)
      const ref = Promise.all([
        Ledger.findOne().sort({T:1}).exec(),                                      // root entry
        Ledger.findOne({ cfg: { $exists: true }}).sort({T:-1}).exec(),            // last cfg entry
        Ledger.findOne().sort({T:-1}).exec()                                      // latest entry
      ])

      const rid = ID.buffer(req.params.rid)
      if(!req.query)  req.body.cfg = [{ host: host, _id: certID }].concat(req.body.cfg)
      const refs = (await ref).map(e => e._id)
      const entry = await chain(Ledger, rid, refs[1], refs, { cfg: cfg }, req.query)        
      const tid = ID.string(entry._id)

      res.headers({'content-id': req.params.rid, 'etag': tid})
      res.code(200).send('"'+tid+'"')

      confirm(req.url + '?'+ entry.T.valueOf(), req.body, tid, req.query, id)

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
      if(r) res.headers({'content-id': req.params.rid, 'etag': req.params.rid})
      res.code(200).send()
    } catch(e) { res.code( 500).send(e) }
    
  })

  a.get('/:rid',
  /*
   * return metadata and configuration of the registry
   */
        async function(req, res) {
          try {
            const r = await Registry.findById(ID.buffer(req.params.rid)).exec()
            const Ledger = m.model('L_'+req.params.rid, _Ledger)

            const c = await Ledger.findOne({ cfg: { $exists: true }}).sort({T:-1}).exec()
            if(r) res.headers({'content-id': req.params.rid, 'etag': req.params.rid})
            const { T, name, description } = r._doc
            const d = { T, name, description, cfg: c.cfg }
            res.code( r ? 200 : 404).send( d )
          } catch(e) { res.code( 500).send(e) }
        })

  a.get('/:rid/', async function(req, res) {
  /*
   * return the ledger of the registry, by default the last version of each document and any connected signatures
   * the returned data can be specified in more detail by query parameters
   */
    try {
      const l = m.model('L_'+req.params.rid, _Ledger)
      const r = await l.find({},'T D V ref name mime key signature confirmations').exec()
      res.code( r ? 200 : 404).send(r)
    } catch(e) { console.log(e); res.code(500).send(e) }
  })
  
  a.get('/:rid/:did/:hash/:tid', async function (req, res) {
  /*
   * return a Ledger entry/transaction for the specfic document version
   * TODO: not properly implemented yet
   */
    try {
      //const Files = m.model('F_'+req.params.rid, _Files)

      // TODO: check root document heritage
      //const file = await Files.findById(ID.buffer(req.params.hash)).exec()
      //console.log(file)
      //const buf = Buffer.from(file.content)
      res.header('content-id',req.params.did)
      res.header('etag',req.params.hash)
      //res.code(200).send( buf )
    } catch (e) { res.code(500).send(e) }
  })

  a.post('/:rid/:did/:hash', async function(req, res) {
  /*
   * Add a signature request or a signature for the document
   * and the same as with adding files, when a date query string is passed, it actually is a check
   */
    try {

      const Ledger = m.model('L_'+req.params.rid, _Ledger)
      const id = ID.buffer(req.params.hash)
      const did = ID.buffer(req.params.did)
      
      const ref = Promise.all([req.body.signature ?
                               Ledger.findOne({ V: id,
                                                key: req.body.key }).sort({T:1}).exec() :                      // referenced signature request entry for signatures
                               Ledger.findOne({ V: did,
                                                key: { $exists: false},
                                                signature: { $exists: false}}).sort({T:1}).exec(),             // document root to sign commit entry for signature requests
                               Ledger.findOne({ V: id,
                                                key: { $exists: false},
                                                signature: { $exists: false}}).sort({T:1}).exec(),             // document version to sign commit entry
                               Ledger.findOne().sort({T:-1}).exec()])                                          // latest entry

      const entry = await chain(Ledger, did, id, (await ref).map(e => e._id), req.body.signature ? {signature: req.body.signature} : req.body, req.query || Date.now() )
      const tid = ID.string(entry._id)
      //console.log('SIGN REQ ' + tid)
      res.header('content-id',ID.string(entry.V))
      res.header('etag',tid)
      res.code(200).send('"'+tid+'"')
      confirm({ url: req.url+'?'+entry.T.valueOf(), method: 'POST', data: req.body }, tid, !!!req.query)
      //confirm('/?'+r.T.valueOf(), req.body, tid, req.query, !!!req.query)
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

  a.get('/*', async function (req, res) {
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
                              function (e,n) { console.log(['ACK', e || n]) } )

    res.code(200).send()

    // send acks to swarm if needed
    if(peer === swarms[req.params.rid][0]) for(let p of swarms[req.params.rid].slice(1))
      if(p !== certID) ht.post('https://'+cluster[p]+':3000' + req.url + '?' + req.query, '')

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
