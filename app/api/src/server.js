import app from '#src/app.js'

/* Set port */
const PORT = 3000
const server = await app({ logger: true })

/* since we are running inside a docker container we need to bin to '0.0.0.0' instead of the default 'localhost' */
const start = async () => {
  try {

    server.listen({port: PORT, host: '0.0.0.0' }, (err, address) => {
      server.log.info('APP RUNNING')

      if (err) {
        server.log.error(err)
        process.exit(1)
      }
    })
  } catch (error) {
    server.log.error({ msg: error, error})
  }
}

start()
