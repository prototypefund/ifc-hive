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

  /* User routes */
  app.post('/users', userPostOptions(app))
  app.get('/users', usersGetOptions(app))
  app.get('/user/:id', userGetOptions(app))
  app.put('/user/:id', userPutOptions(app))
  app.delete('/user/:id', userDeleteOptions(app))
  app.post('/users/search', userSearchOptions(app))
  app.post('/user/login', userLoginOptions(app))

  /* system routes */
  app.post('/system/fixtures', systemFixtures(app))
}

