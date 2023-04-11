/*
 * create an elasticsearch client and decorate the fastify instance with it so
 * the client and its connection can be reused throughout the app
 */
import fp from 'fastify-plugin'
import { Client } from '@elastic/elasticsearch'

export default fp (async function (app, opts) {
  // define sensible defaults
  const defaults = {
    node: 'http://elasticsearch:9200',
    requestTimeout: 6000,
    name: 'defaultEsClient'
  }
  // create the client 
  const es = new Client({ ...defaults, ...opts })
  // decorate the server instance
  app.decorate('es', es)
})
