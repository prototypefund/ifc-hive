import { aliveHandler } from '#src/lib/aliveHandler.js'
// user
import userPostOptions from './routes/user/route.user.post.js'
import usersGetOptions from './routes/user/route.user.getall.js'
import userGetOptions from './routes/user/route.user.get.js'
import userPutOptions from './routes/user/route.user.put.js'
import userDeleteOptions from './routes/user/route.user.delete.js'
import userSearchOptions from './routes/user/route.user.search.js'
import userLoginOptions from './routes/user/route.user.login.js'

// system
import systemFixtures from './routes/system/route.system.fixtures.js'

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
  app.post('/users', userPostOptions(app))
  app.get('/users', usersGetOptions(app))
  app.post('/users/search', userSearchOptions(app))
  app.post('/user/schema', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.get('/user/:id', userGetOptions(app))
  app.put('/user/:id', userPutOptions(app))
  app.delete('/user/:id', userDeleteOptions(app))
  app.post('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.delete('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.post('/user/login', userLoginOptions(app))
  app.post('/user/logout', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.put('/user/password/reset', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.put('/user/password/update', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.get('/user/password/validate-resetkey', { schema: { tags: ['core/user'] } } ,aliveHandler)

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

  /* system routes */
  app.post('/system/fixtures', systemFixtures(app))
  app.post('/system/websocket/default', { schema: { tags: ['core/system'] } } ,aliveHandler)
}

