import fp from 'fastify-plugin'
import jwt from 'fastify-jwt'

export default fp(async function (fastify, opts) {
  fastify.register(jwt, {
    // @TODO pass in as option
    secret: opts.secret,
    decode: { complete: false },
    verify: { maxAge: opts.maxAge || '1d' },
  })

  fastify.decorate('authenticate', async function (req, res) {
    try {
      await req.jwtVerify()
    } catch (err) {
      res.send(err)
    }
  })
})
