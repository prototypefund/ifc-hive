/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifySwagger from 'fastify-swagger' // api documentation
import fastifyCors from 'fastify-cors'
import fastifySensible from 'fastify-sensible'
import mongoose from 'mongoose'
// import autoload from 'fastify-autoload' // autoload routes from directory
import { fileURLToPath } from 'url' // required to emulate __filename
import { dirname } from 'path' // required to emulate __dirname
import vary from 'vary' // required to handle the accept-version header
import swaggerConfig from './lib/swaggerConfig.js' // swagger api documentation configuration
import healthcheck from 'fastify-healthcheck' // simple health check utility

import testitem from './components/testitem/index.js'

/* manually add __filename and __dirname since they are not available in ES modules */
global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

/*
 * import project modules
 */

export default function build (opts = {}) {
  /* create fastify instance
   *
   * @TODO make logging configurable with an env variable
   */
  const app = fastifyFabric({
    // enable logging, note that you can make container logs prettier by using pino-pretty e.g.
    // docker logs -f ifc-dev-pai | npx pino-pretty
    logger: true,
    // we are behind a trusted proxy
    trustProxy: true,
  })

  /* register CORS plugins */
  app.register(fastifyCors, {
    /* allow acces from everywhere. Overwrite this in production (nginx) to only allow clien domain */
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

  /* connect to mongodb @TODO make host and database dynamic with env variables */
  mongoose.connect('mongodb://mongo:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'mongo connection error:'))
  db.once('open', () => {
    app.log.debug('some debugging output')
    app.log.info('Mongodb connected')
  })

  /*
   * manage accept-version header in onSend hook
   *
   * We are using versioning for out end-points. Following the fastify recommendation regarding the version contraint
   * we add the following hook in order to prevent cache poisoning attacks.
   * see https://www.fastify.io/docs/latest/Reference/Routes/#constraints
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
   * check if we meet al pre-conditions
   * - do we have an Accept-Version header (except for docs routes)?
   */
  app.addHook('onRequest', (request, reply, done) => {
    // we want the accept-versio header everywhere except when requesting the documentation routes
    if (!request.headers['accept-version'] && !/(docs|health)/.test(request.req.url)) {
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

  /* register fastifySensible for easier error handling in responses */
  app.register(fastifySensible)

  /* autoload our project components from the ./component directory */
  // app.register(autoload, { dir: join(global.__dirname, 'components') })
  /* register swagger documentation tool */
  app.register(fastifySwagger, swaggerConfig)
  /* simple health check on /health */
  app.register(healthcheck)
  app.register(testitem)

  return app
}
