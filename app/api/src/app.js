/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
// import mongoose from 'mongoose'
import fastifySwagger from '@fastify/swagger' // api documentation
import fastifySwaggerUI from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './lib/swaggerConfig.js' // swagger api documentation configuration
import healthcheck from 'fastify-custom-healthcheck' // simple health check utility
import { fileURLToPath } from 'url' // required to emulate __filename
import { dirname } from 'path' // required to emulate __dirname
import vary from 'vary' // required to handle the accept-version header
import { nanoid } from 'nanoid'
import eventbus from './plugins/eventbus/index.js'
import jwt from './plugins/authentication/index.js'
import mongodb from './plugins/mongodb/index.js'
import socket from './plugins/socket/index.js'

/*
 * import package.json so we know our app version
 * @TODO use the new import ... asssert { type: 'json' } method whhen upgrading node.js
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url)
const _package = require('../package.json')

/* manually add __filename and __dirname since they are not available in ES modules */
global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

/*
 * ENV variables for configuration
 *
 * NODE_ENV             development, production, test
 * API_PORT             port for the api, defaults to 3000
 * API_TOKEN_PUBLIC_KEY
 * API_TOKEN_PRIVAT_KEY
 * API_TOKEN_SECRET     secret for signing the JWT token
 * API_TOKEN_MAX_AGE    max age for valig JWT, e.g. '3600' (seconds), '1d' (days), '1h' (hours)
 * API_ROOT_PASSWORD    with the root password and email we can always create a token and login
 * API_ROOT_EMAIL       
 * MONGO_HOST           mongo host with or without login credentials (e.g. if external server)
 * SOCKET_CORS          https://socket.io/docs/v4/server-options/#cors
 * SOCKET_TIMEOUT       45000   
 * SOCKET_PING_INTERVALL  25000
 * SOCKET_PING_TIMEOUT    20000
 *
 * @TODO add env variables for mongo, es etc. Basically all configuratioan
 * should be done by env-variables.
 * @TODO add sensible defaults for all env variables.
 * @TODO use ajv to validate our env variables schema, e.g. PORT should be an
 * integer etc.
 */

/*
 * ---------------------------------------------------------------------
 * IMPORT YOUR CUSTOM COMPONENTS HERE from ./components
 * ---------------------------------------------------------------------
 */
// lab routes for naive socket integration
import lab from './app/lab/index.js' 
import core from './app/core/index.js'

/*
 * create app function
 */
export default async function app (opts = {}) {

  /* @TODO make logging configurable with an env variable */
  const app = fastifyFabric({
    // enable logging, note that you can make container logs prettier by using pino-pretty e.g.
    // docker logs -f ifc-dev-pai | npx pino-pretty
    logger: true,
    // we are behind a trusted proxy
    trustProxy: true,
    // custom request id generator
    genReqId: (request) => { 
        // if we got an x-request-id header from the client, use its value
        if(request.headers['x-request-id']) return request.headers['x-request-id']
        // otherwise generate a unique id and prepend it with api
        return `api-${nanoid()}`
      }
  })

  /*
   * Check ENV variables
   */
  if (!process.env.API_TOKEN_SECRET || typeof process.env.API_TOKEN_SECRET === 'undefined') {
    app.log.fatal('Missing config API_SECRET')
    process.exit(1)
  }

  /*
   * register custom plugiins
   */
  /* register custom event bus */
  app.register(eventbus)
  /* register jwt authentication plugin */
  app.register(jwt, { secret: process.env.API_TOKEN_SECRET })
  /* connect to mongo */
  app.register(mongodb, { uri: process.env.MONGO_URL })

  app.register(socket)

  /*
   * register other plugins
   */
  /* register fastifySensible for easier error handling in responses */
  app.register(fastifySensible)
  /* register swagger documentation tool */
  app.register(fastifySwagger, swaggerConfig)
  /* register swagger UI component, which is now its own thing */
  app.register(fastifySwaggerUI, swaggerUiConfig)

  /* register CORS plugins */
  app.register(fastifyCors, {
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

  /*
   * add health check
   *
   * @TODO add custom functions to checkt presence and health of
   *  - mongodb
   *  - elasticsearch
   *  - redis
   *  - socket server
   */
  /* simple health check on /health */
  app.register(healthcheck, {
    info: {
      name: _package.name,
      version: _package.version,
      env: process.env.NODE_ENV
    },
    // path: '/health',
    // schema: { tags: ['core/system'] }, // @TODO pass custom schema for swagger
    // exposeFailure: process.env.NODE_ENV !== 'production' ? true : false
  })

  /*
   * ACCEPT-VERSION Header check
   *
   * We are using versioning for out API end-points. Following the fastify
   * recommendation regarding the version contraint we add the following hook
   * in order to prevent cache poisoning attacks. see
   * https://www.fastify.io/docs/latest/Reference/Routes/#constraints
   */
  const append = vary.append // prepare vary
  app.addHook('onSend', async (req, reply) => {
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
  app.addHook('onRequest', (request, reply, done) => {
    // we want the accept-versio header everywhere except when requesting the documentation routes
    // @TODO take care of request.req depreciated
    if ( !request.headers['accept-version']
      && !/(docs|health|websocket)/.test(request.raw.url) // exclude routes 
      && process.env.NODE_ENV === 'production' // only be strict in production @TODO sure?
    ) {
      // send error if we are missing the Accept-Version header
      reply
        .status(412)
        .send({
          statusCode: 412,
          error: 'Missing Header',
          message: 'You must specify an Accept-Version header'
        })
    }
    done()
  })

  /*
   * ---------------------------------------------------------------------
   * REGISTER YOUR PROJECT COMPONENTS HERE
   * ---------------------------------------------------------------------
   */
  app.register(lab, { prefix: '/lab' })
  app.register(core, { prefix: '/core' })

  /*
   * ---------------------------------------------------------------------
   * REGISTER GLOBAL EVENTS
   * ---------------------------------------------------------------------
   */

  await app.ready()

  app.wss.on('connection', (socket) => {

    socket.on('join', (room) => {
      app.log.info(`[Socket] room 7 entered by ${socket.id}`)
      socket.join('7')
      app.wss.sockets.in('7').emit('hello', {msg: `Hello ${socket.id}`})
      app.wss.in('7').fetchSockets()
        .then((sockets) => { 
          app.log.info({ msg: 'members', socket: sockets.map(s => s.id) })
        })
        .catch((err) => { console.log(err) })
    })

    socket.on('leave', (room) => {
      socket.leave('7')
      app.wss.sockets.in('7').emit('hello', {msg: `left room ${socket.id}`})
      app.wss.in('7').fetchSockets()
        .then((sockets) => { 
          app.log.info({ msg: 'members', socket: sockets.map(s => s.id) })
        })
        .catch((err) => { console.log(err) })
    })

    socket.on('details', (args) => {
      app.log.info('[Socket] details received') 
      app.wss.emit('hello', { msg: 'we got your message' })
    })

    app.log.warn(`[socket] connected ${socket.id}`)
    app.wss.emit('hello', { msg: 'some message to you' })

    socket.on('disconnect', () => {
      app.log.warn(`[socket] disconnected ${socket.id}`)
    })
  })

  app.wss.on('connection_error', (err) => {
    console.log(err.req)
    console.log(err.code)
    console.log(err.message)
    console.log(err.context)
  })

  app.eventbus.on('dataUpdate', (payload) => {
    // validate schema
    app.wss.emit('data', payload)
  })

  // return the configured app
  return app
}
