/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifySwagger from 'fastify-swagger' // api documentation
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
  const app = fastifyFabric({ logger: true })

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
    if (!request.headers['accept-version'] && !/docs/.test(request.req.url)) {
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

  /* autoload our project components from the ./component directory */
  // app.register(autoload, { dir: join(global.__dirname, 'components') })
  /* register swagger documentation tool */
  app.register(fastifySwagger, swaggerConfig)
  /* simple health check on /health */
  app.register(healthcheck)
  app.register(testitem)

  return app
}
