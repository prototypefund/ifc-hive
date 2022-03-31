const fastify = require('fastify')({ logger: true })

/* register swagger documentation tool */
fastify.register(require('fastify-swagger'), {
  // show API documentation
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'ifc-hive-api'
    }
  }
})

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
