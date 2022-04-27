import * as opts from './models/user/user.route.options.js'

export default function accessRoutes (app, options, done) {
  /* create new user */
  app.post('/users', opts.addUserOtions)
  /* get user collection */
  app.get('/users', opts.getUsersOptions(app))
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
  app.post('/user/password/reset', opts.passwordForgottenOptions)
  /* update password */
  app.post('/user/password/update', opts.updatePasswordOptions)
  // verify email
  app.get('/user/email/verify/:token', opts.verifyEmailOptions)
  // upload user avatar
  // app.post('/user/:id/avatar', opts.uploadAvatarOptions)
  // delete user avatar
  // app.delete('/user/:id/avatar', opts.deleteAvatarOptions)
  // request token a.k.a login
  app.post('/user/login', opts.loginOptions)
  // app.post('/user/logout', opts.logoutOptions)
  // add permission
  // app.post('/user/:id/permissions', opts.addUserPermissionOptions)
  // app.delete('/user/:id/permissions', opts.deleteAllUserPermissionsOptions)
  // app.delete('/user/:id/permission/:permissionId')
  // app.get('/user/:id/permissions')

  done()
}
