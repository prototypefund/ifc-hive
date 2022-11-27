import t from 'tap'
import https from 'https'
import fs from 'fs'
import axios from 'axios'
import crypto from 'crypto'
import { ID } from '../src/crypto.js'


t.skip('Crypto', async t => {
  t.test('Hash Strings', async t => {
    for(let n = 10; n>0; --n) {
      const d = []
      for(let i = 0; i<32;++i) d[i] = Math.floor(Math.random() * 255);
      const h = ID.string(d)
      const r = ID.buffer(h)
      t.ok(d.every((value, index) => value === r[index]), 're-parsed and matched')
    }
  })
})


let registry = null

// documents
const file0 = "# Agenda\n1. Armee aufbauen\n2. Alle Länder besiegen\n"
const file1 = file0 + "3. Krönen lassen\n"
const file2 = file1 + "4. Profit\n"
const cfg0 = [{host:'ifc-dev-reg1', _id:'13EF1C547123C60250CCD4C80D63A3869577DCAC'}]
const cfg1 = cfg0.concat([{host:'ifc-dev-reg2', _id:'13EF1C547123C60250CCD4C80D63A3869577DCAD'}])
const h0 = ID.string(ID.hash(file0))
const h1 = ID.string(ID.hash(file1))
const h2 = ID.string(ID.hash(file2))

// entries
let e2 = null, p2 = null, s2 = null

const headers = {'Accept-Version': '1', 'Content-Type': 'application/json'}

// now create the test client, needs its own certificates

const agent = new https.Agent({
  cert: fs.readFileSync('test/test.crt'),
  key: fs.readFileSync('test/test.key'),
  ca: fs.readFileSync('ca.crt'),
})

// the pacifico "lead" registry
const ht = axios.create({ baseURL: 'https://ifc-dev-reg0:8083/', headers: headers, httpsAgent: agent })

// the 2 client registries (different parties)
const ht1 = axios.create({ baseURL: 'https://ifc-dev-reg1:8084/', headers: headers, httpsAgent: agent })
const ht2 = axios.create({ baseURL: 'https://ifc-dev-reg2:8085/', headers: headers, httpsAgent: agent })

var log = null

t.only('Registry API', async t => {
  
  t.only('Creating and Querying Registry', async t => {
    const r0 = await ht.post('',{name: "Generalprobe Weltherrschaft", description: "Registry API Test",
                                 cfg: cfg1 })
    registry = r0.headers['etag']
    t.equal(r0.status, 200, 'Registry Created: ' + registry)
    const r1 = await ht.get('')
    t.equal(r1.status, 200, 'Registries Listed: ' + JSON.stringify(r1.data))
    const r2 = await ht.get(registry)
    t.equal(r2.status, 200, 'Registry Info: ' + r2.data.name + ', ' + r2.data.description +
            ', ' + r2.data.cfg[0].host + ', ' + r2.data.cfg[0].host + ' ...')
    const r3 = await ht.get(registry+'/')
    t.equal(r3.status, 200, 'Registry Ledger Created')
    t.equal(r3.data.length, 1, 'Ledger has only Root Element: ' + r3.data[0]._id + ' ' + r3.data.length)
    t.equal(r3.data[0].D, registry, 'Ledger Root Element initialized with Registry Key ' + registry)
/*
    t.pass('Wait for network propagation')
    await new Promise(r => setTimeout(r,500))
    const rr1 = await ht1.get(registry+'/')
    t.equal(rr1.data[0].D, registry, 'Peer 1 Confirmed Mirror Registry: ' + registry)

    const r4 = await ht.post(registry,{ cfg: cfg1})
    t.equal(r4.status, 200, 'New Config Entry: ' + r4.data)
    const r5 = await ht.get(registry)
    t.equal(r5.status, 200, 'Added Peer 2: ' + r5.data.cfg[2].host)
*/
    t.pass('Wait for network propagation')
    await new Promise(r => setTimeout(r,1000))
    const rr3 = await ht1.get(registry+'/')
    const rr4 = await ht2.get(registry+'/')
    //console.log(r3.data,rr3.data,rr4.data)
    t.equal(rr3.data[0].D+rr3.data[0]._id, registry+r3.data[0]._id, 'Peer 1 Confirmed Mirror Registry: ' + registry)
    t.equal(rr4.data[0].D+rr4.data[0]._id, registry+r3.data[0]._id, 'Peer 2 Confirmed Mirror Registry: ' + registry)

  })
  
  t.only('Uploading and Checking Files', async t => {

    t.only('Uploading File', async t => {
      const r0 = await ht.put(registry+'/'+h0+'/'+h0, file0, { headers: { 'content-type': 'text/plain', 'content-location':'agenda.txt'}})
      t.equal(r0.status, 200, 'File Uploaded: ' + h0)
      t.equal(r0.headers['etag'], h0,'File Hash Confirmed')


      const r1 = await ht.get(registry+'/'+h0+'/'+h0)
      t.equal(r1.headers['content-id'], h0,'Document ID Confirmed')
      t.equal(r1.headers['etag'], h0,'Document Version Confirmed')

      const r2 = await ht.get(registry+'/')
      const last0 = r2.data.slice(-1)
      t.equal(last0[0].D,h0,'Document ID in Ledger Confirmed')

      t.equal(r2.data[1].ref[0], r2.data[0]._id,'First Chain Link to Root Confirmed')
      t.equal(r2.data[1].ref[1], r2.data[0]._id,'Second Chain Link to Root Confirmed')
      
      t.pass('Wait for network propagation')
      await new Promise(r => setTimeout(r,500))
      const rr1 = await ht1.get(registry+'/')
      const rr2 = await ht2.get(registry+'/')
      t.equal(rr1.data[1].V+rr1.data[1].ref[1], h0+r2.data[1].ref[1], 'Peer 1 Confirmed Mirror File: ' + h0)
      t.equal(rr2.data[1].V+rr2.data[1].ref[1], h0+r2.data[1].ref[1], 'Peer 2 Confirmed Mirror File: ' + h0)
      })

    t.test('Updating File', async t => {
      const r3 = await ht.put(registry+'/'+h0+'/'+h1, file1, { headers: { 'content-type': 'text/plain'}})
      t.equal(r3.status, 200, 'File Updated: ' + h1)
      t.equal(r3.headers['etag'], h1,'Updated File Hash Confirmed')

      const r4 = await ht.get(registry+'/'+h0+'/'+h1)
      t.equal(r4.headers['content-id'], h0,'Root Document ID Confirmed')
      t.equal(r4.headers['etag'], h1,'Updated Document Version Confirmed')

      const r5 = await ht.get(registry+'/')
      const last1 = r5.data.slice(-1)
      t.equal(last1[0].V, h1,'Updated Version Document ID in Ledger Confirmed')

      t.equal(r5.data[2].ref[0], r5.data[1]._id,'First Chain Link to Base Document Confirmed')
      t.equal(r5.data[2].ref[1], r5.data[1]._id,'Second Chain Link to Previous Document, Same as Base Document, Confirmed')

      t.pass('Wait for network propagation')
      await new Promise(r => setTimeout(r,500))
      const rr1 = await ht1.get(registry+'/')
      const rr2 = await ht2.get(registry+'/')
      t.equal(rr1.data[2].V+rr1.data[2].ref[1], h1+r5.data[2].ref[1], 'Peer 1 Confirmed Mirror File: ' + h1)
      t.equal(rr2.data[2].V+rr2.data[2].ref[1], h1+r5.data[2].ref[1], 'Peer 2 Confirmed Mirror File: ' + h1)
    })
    
    t.test('Updating File Again', async t => {
      const r6 = await ht.put(registry+'/'+h0+'/'+h2, file2, { headers: { 'content-type': 'text/plain'}})
      t.equal(r6.status, 200, 'File Updated Again: ' + h2)
      t.equal(r6.headers['etag'], h2,'Newly Updated File Hash Confirmed')

      const r7 = await ht.get(registry+'/'+h0+'/'+h2)
      t.equal(r7.headers['content-id'], h0,'Same Root Document ID Confirmed')
      t.equal(r7.headers['etag'], h2,'Newly Updated Document Version Confirmed')

      const r8 = await ht.get(registry+'/')
      const last2 = r8.data.slice(-1)
      t.equal(last2[0].V, h2,'Newly Updated Version Document ID in Ledger Confirmed')

      t.equal(r8.data[3].ref[0], r8.data[1]._id,'First Chain Link to Base Document Confirmed')
      t.equal(r8.data[3].ref[1], r8.data[2]._id,'Second Chain Link to Previous Document Confirmed')

      t.pass('Wait for network propagation')
      await new Promise(r => setTimeout(r,500))
      const rr1 = await ht1.get(registry+'/')
      const rr2 = await ht2.get(registry+'/')
      t.equal(rr1.data[3].V+rr1.data[3].ref[1], h2+r8.data[3].ref[1], 'Peer 1 Confirmed Mirror File: ' + h2)
      t.equal(rr2.data[3].V+rr2.data[3].ref[1], h2+r8.data[3].ref[1], 'Peer 2 Confirmed Mirror File: ' + h2)
    })
  })
  t.test('Signing Files', async t => {


    t.pass('Creating Key Pair')
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

    const pk = publicKey.export({ type: 'spki', format: 'pem' })

    const r0 = await ht.post(registry+'/'+h0+'/'+h1, { key: pk })
    t.equal(r0.status, 200, 'Signing Request: ' + r0.data)


    const r1 = await ht.get(registry+'/'+h0+'/'+h1+'/')
    t.equal(r1.status, 200, 'Signing Request Ledger Entries Retrieved')
    e2 = r1.data[0]   // document commit entry
    p2 = r1.data[1]   // signing request entry
    const canonical = JSON.stringify(e2)

    t.pass('Wait for network propagation')
    await new Promise(r => setTimeout(r,500))
    const rr1 = await ht1.get(registry+'/')
    const rr2 = await ht2.get(registry+'/')
    t.equal(rr1.data[4]._id, r0.data, 'Peer 1 Confirmed Mirror Signing Request: ' + r0.data)
    t.equal(rr2.data[4]._id, r0.data, 'Peer 2 Confirmed Mirror Signing Request: ' + r0.data)


    const signature = crypto.sign('SHA256', canonical , privateKey);
    const sg = signature.toString('base64')
    const sgDisplay = sg.slice(0,32) + '...'
    t.pass('Signed: ' + sgDisplay)
    

    const r2 = await ht.post(registry+'/'+h0+'/'+h1, { key: pk, signature: sg })
    t.equal(r2.status, 200, 'Signature Submitted: ' + r2.data)

    const r3 = await ht.get(registry+'/'+h0+'/'+h1+'/')
    t.equal(r3.status, 200, 'Signature Entry Retrieved')
    s2 = r3.data[2]  // signature entry

    const _publicKey = crypto.createPublicKey(p2.key, { format: 'pem' })
    const _signature = Buffer.from(s2.signature,'base64')
    
    t.ok(crypto.verify('SHA256', canonical, _publicKey, _signature),'Signature verified: ' + sgDisplay)

    t.pass('Wait for network propagation')
    await new Promise(r => setTimeout(r,500))
    const rr3 = await ht1.get(registry+'/')
    const rr4 = await ht2.get(registry+'/')
    t.equal(rr3.data[5]._id, s2._id, 'Peer 1 Confirmed Mirror Signature Entry: ' + s2._id)
    t.equal(rr4.data[5]._id, s2._id, 'Peer 2 Confirmed Mirror Signature Entry: ' + s2._id)
    log = rr4.data.map(e =>  `\t${e._id}: ${e.confirmations.join(" ")}`)

  })
  
  t.test('Cleanup', async t => {
    setTimeout(async function() {
      const r0 = await ht.delete('/')
      const r1 = await ht1.delete('/')
      const r2 = await ht2.delete('/')
      console.log('...')
      console.log('Ledger Entries and Confirmations')
      log?.forEach( e => console.log(e))
    } , 3000)
  })
})

