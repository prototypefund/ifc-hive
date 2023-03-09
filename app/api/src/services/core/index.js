import userPostOptions from './routes/user/route.user.post.js'

/*
 * Core service export all routes
 */
export default async function (app) {

  /* Alive route for the core */
  app.get('/alive', function (request, reply) {})

  app.post('/users', userPostOptions)
}

