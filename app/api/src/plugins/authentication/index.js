import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async function (fastify, opts = {}) {
  // provide some sensible options
  const defaults = {
    secret: false,
    decode: { complete: true },
    sign: {
      iss: 'api.projectjournal.pacifico.info',
      expiresIn: '30d' 
    },
    verify: { allowedIss: 'api.projectjournal.pacifico.info' }
  }
  const mergedOptions = {...defaults, ...opts}

  /* register the plugin */
  fastify.register(jwt, mergedOptions)

  // decorate the fastify instance, so we can call it anywhere
  fastify.decorate('authenticate', async function (req, res) {
    try {
      await req.jwtVerify()
      fastify.log.info({ msg: 'Get user from database' })
    } catch (err) {
      res.send(err)
    }
  })
})
