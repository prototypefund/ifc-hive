import userPostOptions from './routes/user/route.user.post.js'
import usersGetOptions from './routes/user/route.user.getall.js'
import userGetOptions from './routes/user/route.user.get.js'
import userPutOptions from './routes/user/route.user.put.js'
import userDeleteOptions from './routes/user/route.user.delete.js'
import userSearchOptions from './routes/user/route.user.search.js'

/*
 * Core service export all routes
 */
export default async function (app) {

  /* Alive route for the core */
  app.get('/alive', function (request, reply) {})

  /* User routes */
  app.post('/users', userPostOptions)
  app.get('/users', usersGetOptions)
  app.get('/user/:id', userGetOptions)
  app.put('/user/:id', userPutOptions)
  app.delete('/user/:id', userDeleteOptions)
  app.post('/users/search', userSearchOptions)
}

