import registry from '#src/registry.js'


import fastifyFabric from 'fastify'
import fastifySwagger from '@fastify/swagger' // api documentation
import fastifyCors from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import jwt from '@fastify/jwt'
import healthcheck from 'fastify-healthcheck' // simple health check utility
import { fileURLToPath } from 'url' // required to emulate __filename
import fs from 'fs'
import { dirname, join } from 'path' // required to emulate __dirname
import vary from 'vary' // required to handle the accept-version header
import swaggerConfig from './swaggerConfig.js' // swagger api documentation configuration
import { nanoid } from 'nanoid'

/*
 * This contains all the infrastructure and boilerplate for the registry server
 * The actual functionality and API implementation is under registry.js
 *

   a registry cluster a set of hosts with ssl certificates issued by the pacifico certificate authority
   that means each registry instance has the ca.crt file to identify the private pacifico CA,
   each registry instance has its own certificate issued by the pacifico CA
   the configuration of each registry swarm uses the hostnames and serial numbers of those certificates
 */
const certs_dir = process.env.REG_CERTIFICATE_DIRECTORY || ''
const instance = process.env.REG_HOST.split('-')[2]
const port = process.env.REG_PORT || 3000
const ckey = fs.readFileSync( join(certs_dir, instance + '.key' ))
const cert = fs.readFileSync( join(certs_dir, instance + '.crt' ))
const ca = fs.readFileSync( join(certs_dir, 'ca.crt' ))
const ca_key = process.env.REG_CLUSTER_CA_KEY                           // only set for lead instance

/* just a normal fastify server */
const server = fastifyFabric({
  // enable logging, note that you can make container logs prettier by using pino-pretty e.g.
  // docker logs -f ifc-dev-pai | npx pino-pretty
  logger: { level: 'debug' },
  // we are behind a trusted proxy
  trustProxy: true,
  // custom request id generator
  genReqId: () => nanoid(),
  https: { key: ckey, cert: cert, ca: ca,
           requestCert: true,
           rejectUnauthorized: false
         },
  querystringParser: s => Number.parseInt(s)
})

/*
 * APP CONFIGURATION FROM ENV VARIABLES
 * ----------------------------------------------------------------------------------------------
 */
if (!process.env.REG_TOKEN_SECRET || process.env.REG_TOKEN_SECRET === 'undefined' || !process.env.REG_HOST ) {
  server.log.fatal('Missing config REG_TOKEN_SECRET or REG_HOST')
  process.exit(1)
}

/*
 * REGISTER AND CONFIGURE GLOBAL PLUGINS
 * ----------------------------------------------------------------------------------------------
 */

/* register jwt authentication plugin */
server.register(jwt, {
  // @TODO pass in as option
  secret: process.env.REG_TOKEN_SECRET,
  decode: { complete: false },
  verify: { maxAge: process.env.REG_TOKEN_MAX_AGE || '1d' },
})

/*
if(process.env.REG_TOKEN_SECRET) server.decorate('authenticate', async function (req, res) {
  try { await req.jwtVerify() }
  catch (err) { res.send(err) }
})
*/

/* register CORS plugins */
server.register(fastifyCors, {
  /* allow acces from everywhere. Overwrite this in prod env (nginx), e.g. client domain only */
  origin: '*',
  /* allow all HTTP verbs */
  methods: 'GET,PUT,HEAD,POST,PATCH,DELETE,CONNECT,OPTIONS,TRACE',
  /* be relaxed with preflight requests. Overwrite this in production (nginx proxy) */
  strictPreflight: false,
  /* define th allowed headers */
  allowHeader: [
    'Accept',
    'Accept-Version', // required in most of our route, exepct /docs and /health
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Authorization',
    'Content-Range',
    'Content-Type',
    'Origin',
  ]
})
/* register fastifySensible for easier error handling in responses */
server.register(fastifySensible)
/* register swagger documentation tool */
server.register(fastifySwagger, swaggerConfig)
/* simple health check on /health */
server.register(healthcheck)

// pass working directory to plugins, the actual files that are registered are stored there
server.decorate('dir', join(process.env.REG_FILES_DIRECTORY || process.env.PWD , instance))

/*
 * ACCEPT-VERSION HANDLING
 * ----------------------------------------------------------------------------------------------
 *
 * We are using versioning for our end-points. Following the fastify
 * recommendation regarding the version contraint we add the following hook
 * in order to prevent cache poisoning attacks. see
 * https://www.fastify.io/docs/latest/Reference/Routes/#constraints
 */
const append = vary.append // prepare vary
server.addHook('onSend', async (req, reply) => {
  // do we have an accep-version header?
  if (req.headers['accept-version']) {
    // let the vary package to its thing
    const value = reply.getHeader('Vary') || ''
    const header = Array.isArray(value) ? value.join(', ') : String(value)
    if ((value === append(header, 'Accept-Version'))) {
      reply.header('Vary', value)
    }
  }
})
/*
 * check if we meet al pre-conditions do we have an Accept-Version header
 * Disregard routes /docs and health
 */
server.addHook('onRequest', (request, reply, done) => {
  // we want the accept-versio header everywhere except when requesting the documentation routes
  // @TODO take care of request.req depreciated
  if (!request.headers['accept-version'] && !/(docs|health)/.test(request.raw.url)) {
    reply.status(412).send({ statusCode: 412, error: 'Missing Header',
                             message: 'You must specify an Accept-Version header' })
  }
  done()
})

/* 
 * the mongodb connection string should be made configurable with env variables
 * the registry uses same mongodb as the application server, if there is an application server on the machine
 * it just uses different collections
 */

server.register(registry, { mongo: 'mongodb://mongo:27017/ifc-hive' + (ca_key ? '' : '_' + instance), port: port } )

/* since we are running inside a docker container we need to bin to '0.0.0.0' instead of the default 'localhost' */
server.listen(port, '0.0.0.0', (err, address) => {
  server.log.info('APP RUNNING')
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
