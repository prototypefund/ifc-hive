import { aliveHandler } from '#src/lib/aliveHandler.js'

import * as system from './routes/system/index.js'
import * as tag from './routes/tag/index.js'
import * as user from './routes/user/index.js'
import * as project from './routes/project/index.js'
import * as account from './routes/account/index.js'

/*
 * Core service export all routes
 */
export default async function (app) {


  /* account */
  app.post('/accounts', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.get('/accounts', account.getAll(app) )
  app.post('/accounts/search', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.post('/account/schema', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.get('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.put('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)
  app.delete('/account/:id', { schema: { tags: ['core/account'] } } ,aliveHandler)

  /* project */
  app.get('/projects', project.getAll(app))
  app.get('/project/:id', project.get(app))
  app.put('/project/:id', project.put(app))
  app.delete('/project/:id', project.remove(app))
  app.post('/project/search', { schema: { tags: ['core/project'] } }, aliveHandler)
  app.get('/project/model', project.model(app))
  app.put('/project/:id/config', project.putConfig(app))

  /* User routes */
  app.post('/user/login', user.login(app))
  app.post('/users', user.post(app))
  app.get('/users', user.getAll(app))
  app.post('/users/search', user.search(app))
  app.get('/user/:id', user.get(app))
  app.put('/user/:id', user.put(app))
  app.delete('/user/:id', user.remove(app))
  app.get('/user/check-token', user.checkToken(app))
  app.patch('/user/last-project/:projectId', user.patchLastProject(app))
  // app.post('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  // app.delete('/user/:id/avatar', { schema: { tags: ['core/user'] } } ,aliveHandler)
  app.post('/user/model', user.model(app))
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
  app.get('/tags', tag.getAll(app))
  app.get('/tag/:id', tag.get(app))
  app.put('/tag/:id', tag.put(app))
  app.delete('/tag/:id', tag.remove(app))
  app.get('/tag/model', tag.model(app))

  /* system routes */
  app.post('/system/fixtures', system.fixtures(app))
  app.get('/system/alive',  { schema: { tags: ['core/system'] } }, aliveHandler)
}

