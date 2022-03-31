/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifySwagger from 'fastify-swagger' // api documentation
import vary from 'vary'
import swaggerConfig from './lib/swaggerConfig.js' // swagger api documentation configuration
import healthcheck from 'fastify-healthcheck'
import itemRoutes from '#src/bundle.items/routes/index'

const append = vary.append

/*
 * import project modules
 */

export default function build (opts = {}) {
  /* create fastify instance */
  const app = fastifyFabric({ logger: true })

  /* prevent cache poisining attacks when using the Accept-Version header */
  app.addHook('onSend', async (req, reply) => {
    if (req.headers['accept-version']) {
      const value = reply.getHeader('Vary') || ''
      const header = Array.isArray(value) ? value.join(', ') : String(value)
      if ((value === append(header, 'Accept-Version'))) {
        reply.header('Vary', value)
      }
    }
  })

  /* register swagger documentation tool */
  app.register(fastifySwagger, swaggerConfig)
  /* simple health check on /health */
  app.register(healthcheck)

  /*
   * register project modules
   */
  app.register(itemRoutes)

  return app
}
