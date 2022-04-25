import * as opts from './models/user/user.route.options.js'

export default function accessRoutes (app, options, done) {
  /* create new user */
  app.post('/users', opts.addUserOtions)
  /* get user collection */
  app.get('/users', opts.getUsersOptions)
  /* get single user by _id */
  app.get('/user/:id', opts.getUserOptions)
  /* update single user by _id */
  app.put('/user/:id', opts.updateUserOptions)
  /* delete single user by _id */
  app.delete('/user/:id', opts.deleteUserOptions)
  /* validate username */
  app.get('/user/validate/username/:username', opts.validateUsernamOptions)
  /* validate reset passwort token */
  app.get('/user/validate/reset-token/:token', opts.validateResetToken)
  /* reset password */
  app.post('/user/reset-password', opts.passwordForgottenOptions)

  done()
}
