import * as opts from './models/user/user.route.options.js'
import * as accountOpts from './models/account/account.route.options.js'

export default function accessRoutes (app, options, done) {
  /*
   * account routes
   */
  app.post('/accounts', accountOpts.createAccountOptions(app))
  app.get('/accounts', accountOpts.createAccountOptions(app))
  app.get('/account/:id', accountOpts.createAccountOptions(app))
  app.put('/account/:id', accountOpts.createAccountOptions(app))
  app.delete('/account/:id', accountOpts.createAccountOptions(app))

  /*
   * User routes
   */
  /* create new user */
  app.post('/users', opts.addUserOtions(app))
  /* get user collection */
  app.get('/users', opts.getUsersOptions(app))
  /* get single user by _id */
  app.get('/user/:id', opts.getUserOptions(app))
  /* update single user by _id */
  app.put('/user/:id', opts.updateUserOptions(app))
  /* delete single user by _id */
  app.delete('/user/:id', opts.deleteUserOptions(app))
  /* validate username */
  app.get('/user/validate/username/:username', opts.validateUsernamOptions(app))
  /* validate reset passwort token */
  app.get('/user/validate/reset-token/:token', opts.validateResetToken(app))
  /* reset password */
  app.post('/user/password/reset', opts.passwordForgottenOptions(app))
  /* update password */
  app.post('/user/password/update', opts.updatePasswordOptions(app))
  // verify email
  app.get('/user/email/verify/:token', opts.verifyEmailOptions(app))
  // upload user avatar
  // app.post('/user/:id/avatar', opts.uploadAvatarOptions)
  // delete user avatar
  // app.delete('/user/:id/avatar', opts.deleteAvatarOptions)
  // request token a.k.a login
  app.post('/user/login', opts.loginOptions(app))
  // app.post('/user/logout', opts.logoutOptions)
  // add permission
  // app.post('/user/:id/permissions', opts.addUserPermissionOptions)
  // app.delete('/user/:id/permissions', opts.deleteAllUserPermissionsOptions)
  // app.delete('/user/:id/permission/:permissionId')
  // app.get('/user/:id/permissions')

  done()
}
