import fp from 'fastify-plugin'
import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

  // do not use pluralized versions of the model names as collections names
mongoose.pluralize(function (name) { return name })

export default fp(async function (app, opts) {

  /* connect to mongodb @TODO make host and database dynamic with env variables */
  mongoose.connect(opts.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })


  // @TODO descorate fastify with mongoose connection
  const db = mongoose.connection

  // add mongoose event handlers
  db.on('error', console.error.bind(console, 'mongo connection error:'))
  db.once('open', () => {
    app.log.info(`Mongodb connected to ${opts.uri}`)
  })

  // make the db connection available in all routes
  // @TODO insert into onReqeust  Hook
  app.decorate('db', db)
})
