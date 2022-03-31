import app from '#src/app'

/* Set port */
const PORT = 5000

const server = app({ logger: true })

server.listen(PORT, (err, address) => {
  server.log.info('APP RUNNING')
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
