import mongoose from 'mongoose'
import crypto from 'crypto'
import { ID } from './crypto.js'
import https from 'https'
import fs from 'fs'
import { join, dirname } from 'path'
import { X509Certificate } from 'crypto'
import axios from 'axios'
const { Schema } = mongoose


/*
 * Basic Registry Functionality
 */

var dir = null
var _Ledger = null

const headers = {'Accept-Version': '1', 'Content-Type': 'application/json'}

function hashAndStoreParser(req, body, done) {
/*
 * Writes the request body to file determined by URL
 * takes checksum of request body and compares it to checksum in URL
 * passes on checksums in Array format as request body for use in ledger logic
 */
  
  if (body === '' || !body) return done(undefined, undefined)
  try {
    const hash = crypto.createHash('sha256')
    const path = join(dir, req.url)
    const [did,chk] = req.url.split('?')[0].split('/').slice(2)
    fs.mkdirSync(dirname(path), {recursive: true})
    const f = fs.createWriteStream(path)
    var length = 0
    
    body.on('data', chunk => {
      f.write(chunk)
      hash.write(chunk)
      length += chunk.length
      
    })

    body.on('end', () => {
      f.end()
      hash.end()
      const chksum = [...hash.read()]
      if(ID.string(chksum) !== chk) done(`Checksum failed: ${ID.string(chksum)} != ${chk}`, undefined)
      else done(undefined, { did: ID.buffer(did), id: chksum, data: path, length: length})
    })
  } catch (e) { e.statusCode = 400; return done(e, undefined) }
}


export default function files(a, opt, done) {

  const m = opt.db.connection 
  const _Ledger = opt.ledger
  dir = a.dir

  a.removeAllContentTypeParsers()
  a.addContentTypeParser('*', hashAndStoreParser)

  a.put('/:rid/:did/:hash', async function(req, res) {
  /*
   * Add a document or new document version to the registry.
   * Returns a transaction ID or an error
   * To start a new document and not just a new document version, documentID and hash are the same, i.e. the hash of the first document is the documentID
   * when a Date query string is added, this is not the initial addition but an instance server asking for confirmation
   */

    try {

      const Ledger = m.model('L_'+req.params.rid, _Ledger)
      const ref2 = await Ledger.findOne().sort({T:-1}).exec()         // latest entry
      const metadata = {}
      const headers = {}
      const refs = []

      
      if(req.params.did === req.params.hash) { // new document
        const ref0 = await Ledger.findOne().sort({T:1}).exec()    // register init entry
        headers['content-type'] = metadata['mime'] = req.headers['content-type']
        headers['content-location'] = metadata['name'] = req.headers['content-location']
        refs[0] = ref0._id
        refs[1] = ref0._id
        refs[2] = ref2._id
      }
      else { // update
        const ref0 = await Ledger.find({ D: req.body.did}).sort({T:1}).exec()    // document commit history
        refs[0] = ref0[0]._id
        refs[1] = ref0.slice(-1)[0]._id
        refs[2] = ref2._id
      }

      res.header('etag', req.params.hash)
      res.header('content-id', req.params.did)
      const peers = req.headers['confirm']?.split(' ')
      const n = await opt.chain(Ledger, req.body.did, req.body.id, refs, metadata, req.query || Date.now())

      const tid = ID.string(n._id)
      res.code(200).send('"'+tid+'"')
      opt.confirm({ url: req.url + '?'+ n.T.valueOf(), method: 'PUT', data: req.body.data,
                    headers: { 'content-length': req.body.length, ...headers }}, tid, !!!req.query)
    } catch (e) { res.code( typeof e === 'number' ? e : 500).send(e) }
  })
 
  a.head('/:rid/:did', async function(req, res) {
  /*
   * Check if document with 'did' exists, returns latest hash in header
   */
    if (fs.existsSync(join(dir, req.params.rid.slice(0,2), req.params.rid.slice(2), req.params.did))) {
      const Ledger = m.model('L_'+registry, _Ledger)
      
      res.header('etag', )
      res.header('content-id', req.params.did)
      
      res.code(200).send()
    }
    else res.code(404).send()

  })

  a.get('/:rid/:did', async function(req, res) {
  /*
   * Return the latest version of the document with root ID did (i.e. first version was did)
   */
    try {
      const Ledger = m.model('L_'+req.params.rid, _Ledger)

      const r = await Ledger.find().sort({T:1}).exec()

      //console.log(r)
      //const mime = r[0].mime
      //const name = r[0].name
      //const latest = r.slice(-1)[0].hash
      //res.header('content-type', mime)
      //res.header('content-location', name)
      res.code(200).send( '' )
      //fs.readFile(join(dir,req.url,), (e, content) => {
      //  if(e) throw e
      //  res.code(200).send( content )
      //})
    } catch (e) { res.code(500).send(e) }
  })

  
  //a.get('/:rid/:did/', async function(req, res) {
  /*
   * return the complete ledger history of all versions of the document, including signatures and signature requests
   */

  
  // a.head('/:rid/:did/:hash', async function () {
  /*
   * Check if the document with 'did' and the version 'hash' exists
   */

  //})

  a.get('/:rid/:did/:hash', function (req, res) {
  /*
   * return the specific document version
   */
    try {

      const path = join(dir, req.url)
      // TODO: check root document heritage
      res.header('content-id',req.params.did)
      res.header('etag',req.params.hash)
      fs.readFile(path, (err, data) => {
        if (err) throw err;
        res.code(200).send( data )
      })

    } catch (e) { res.code(500).send(e) }
  })

  a.get('/:rid/:did/:hash/', async function (req, res) {
  /*
   * return the Ledger entries for the specfic document version
   */
    try {
      const Ledger = m.model('L_'+req.params.rid, _Ledger)

      const entries = await Ledger.find({ V: ID.buffer(req.params.hash)}, 'T D V ref key signature' ).exec()
      res.code(200).send( entries )
    } catch (e) { res.code(500).send(e) }
  })

  done() 
}
