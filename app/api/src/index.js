/*
 * Primary entry file to the app
 */
import fastifyFabric from 'fastify'
import itemRoutes from './routes/item.routes.js'

/*
 * build configuration from env and default values
 * @TODO read out env variables for configration
 */

/* create fastify instance */
const fastify = fastifyFabric({ logger: true })

/* register swagger documentation tool */
fastify.register(import('fastify-swagger'), import('./lib/swaggerConfig.js'))

/* register routes */
fastify.register(itemRoutes)

/* Set port */
const PORT = 5000

/* define server */
const start = async () => {
  try {
    await fastify.listen(PORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

/* start server */
start()
