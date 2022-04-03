import app from '#src/app'

/* Set port */
const PORT = 3000

const server = app({ logger: true })

/* since we are running inside a docker container we need to bin to '0.0.0.0' instead of the default 'localhost' */
server.listen(PORT, '0.0.0.0', (err, address) => {
  server.log.info('APP RUNNING')
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
