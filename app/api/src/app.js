/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import fastifySwagger from 'fastify-swagger' // api documentation
import swaggerConfig from './lib/swaggerConfig.js' // swagger api documentation configuration
import healthcheck from 'fastify-healthcheck'

/*
 * import project modules
 */
import itemRoutes from '#src/bundle.items/routes/index'

export default function build (opts = {}) {
  /* create fastify instance */
  const app = fastifyFabric({ logger: true })

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
