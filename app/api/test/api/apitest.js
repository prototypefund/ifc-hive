import { test } from 'tap'
import app from '../../src/app.js'

test('First API test', async (t) => {

  const server = await app()
  await server.listen({ port: 3001, host: '0.0.0.0' })
  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/health'
  })

  t.equal(2, 2, 'should be equal')

  console.log('response code', response.statusCode)
  console.log('resposne body', response.body)
})


