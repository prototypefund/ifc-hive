/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import mongoose from 'mongoose'
import fastifySwagger from '@fastify/swagger' // api documentation
import fastifySwaggerUI from '@fastify/swagger-ui'
import { swaggerConfig, swaggerUiConfig } from './lib/swaggerConfig.js' // swagger api documentation configuration
import websocket from '@fastify/websocket'
import healthcheck from 'fastify-custom-healthcheck' // simple health check utility
import { fileURLToPath } from 'url' // required to emulate __filename
import { dirname } from 'path' // required to emulate __dirname
import vary from 'vary' // required to handle the accept-version header
import { nanoid } from 'nanoid'
import eventbus from './plugins/eventbus/index.js'
// import jwt from './plugins/authentication/index.js'

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
 * API_TOKEN_SECRET     secret for signing the JWT token
 * API_TOKEN_MAX_AGE    max age for valig JWT, e.g. '3600' (seconds), '1d' (days), '1h' (hours)
 * API_PORT             port for the api, defaults to 3000
 *
 * @TODO add env variables for mongo, es etc. Basically all configuratioan
 * should be done by env-variables.
 * @TODO add sensible defaults for all env variables.
 */

/*
 * ---------------------------------------------------------------------
 * IMPORT YOUR CUSTOM COMPONENTS HERE from ./components
 * ---------------------------------------------------------------------
 */
// lab routes for naive socket integration
import lab from './components/lab/index.js' 
import core from './services/core/index.js'

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
    genReqId: () => nanoid()
  })

  /* register websocket server */
  app.register(websocket)
  /* register custom event bus */
  app.register(eventbus)

  /* register jwt authentication plugin */
  // app.register(jwt, {
  //   secret: process.env.API_TOKEN_SECRET,
  //   maxAge: process.env.API_TOKEN_MAX_AGE,
  // })

  /*
   * APP CONFIGURATION FROM ENV VARIABLES
   */
  if (!process.env.API_TOKEN_SECRET || process.env.API_TOKEN_SECRET === 'undefined') {
    app.log.fatal('Missing config API_SECRET')
    process.exit(1)
  }

  /*
   * CONNECT TO MONGO
   */
  // the default value for strictQuery will be changed to false in future version
  // see mongoose depreciation warning.
  mongoose.set('strictQuery', false)

  /* connect to mongodb @TODO make host and database dynamic with env variables */
  mongoose.connect('mongodb://mongo:27017/ifc-hive', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // @TODO descorate fastify with mongoose connection
  const db = mongoose.connection

  // add mongoose event handlers
  db.on('error', console.error.bind(console, 'mongo connection error:'))
  db.once('open', () => {
    app.log.debug('some debugging output')
    app.log.info('Mongodb connected')
  })

  /*
   * REGISTER AND CONFIGURE GLOBAL PLUGINS
   */
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

  /* register fastifySensible for easier error handling in responses */
  app.register(fastifySensible)
  /* register swagger documentation tool */
  app.register(fastifySwagger, swaggerConfig)
  /* register swagger UI component, which is now its own thing */
  app.register(fastifySwaggerUI, swaggerUiConfig)

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
    schema: false, // @TODO pass custom schema for swagger
    exposeFailure: process.env.NODE_ENV !== 'production' ? true : false
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

  // return the configured app
  return app
}
