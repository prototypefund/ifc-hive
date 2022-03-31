const fastify = require('fastify')({ logger: true })
const swaggerConfig = require('./lib/swaggerConfig')

/* register swagger documentation tool */
fastify.register(require('fastify-swagger'), swaggerConfig)

/* register routes */
fastify.register(require('./routes/item.routes'))

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
