import fp from 'fastify-plugin'
import EventEmitter from 'events'

export default fp(async function (fastify, opts) {

  const eventbus = new EventEmitter()
  fastify.decorate('eventbus', eventbus)
})
