import { aliveHandler } from '#src/lib/aliveHandler.js'

import * as system from './routes/system/index.js'
import * as tag from './routes/tag/index.js'
import * as user from './routes/user/index.js'

/*
 * Core service export all routes
 */
export default async function (app) {

  /* Alive route for the core */
  app.get('/alive', function (request, reply) {})

  /* account */
  app.post('/accounts/', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.get('/accounts/', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.post('/accounts/search', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.post('/account/schema', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.get('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.put('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.delete('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)

  /* User routes */
  app.post('/users', user.post(app))
  app.get('/users', user.getAll(app))
  app.post('/users/search', user.search(app))
  app.post('/user/schema', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.get('/user/:id', user.get(app))
  app.put('/user/:id', user.put(app))
  app.delete('/user/:id', user.remove(app))
  // app.post('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  // app.delete('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.post('/user/login', user.login(app))
  // app.post('/user/logout', { schema: { tags: ['core/user'] } } ,aliveHandler)
  // app.put('/user/password/reset', { schema: { tags: ['core/user'] } } ,aliveHandler)
  // app.put('/user/password/update', { schema: { tags: ['core/user'] } } ,aliveHandler)
  // app.get('/user/password/validate-resetkey', { schema: { tags: ['core/user'] } } ,aliveHandler)

  /* organization */
  app.post('/organizations/', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.get('/organizations/', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.post('/organizations/search', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.post('/organization/schema', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.get('/organization/:id', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.put('/organization/:id', { schema: { tags: ['core/organization'] } } ,aliveHandler)
  app.delete('/organization/:id', { schema: { tags: ['core/organization'] } } ,aliveHandler)

  /* permission */
  app.post('/permissions/', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.get('/permissions/', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.post('/permissions/search', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.post('/permission/schema', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.get('/permissions/definitions', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.get('/permission/:id', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.put('/permission/:id', { schema: { tags: ['core/permission'] } } ,aliveHandler)
  app.delete('/permission/:id', { schema: { tags: ['core/permission'] } } ,aliveHandler)

  /* tag */
  app.get('/tag/_model', tag.model(app))
  app.get('/tags', tag.getAll(app))
  app.post('/search', aliveHandler)
  app.get('/tag/:id', tag.get(app))
  app.put('/tag/:id', tag.put(app))
  app.delete('/tag/:id', tag.remove(app))

  /* system routes */
  app.post('/system/fixtures', system.fixtures(app))
  app.post('/system/websocket/default', { schema: { tags: ['core/system'] } } ,aliveHandler)
}

