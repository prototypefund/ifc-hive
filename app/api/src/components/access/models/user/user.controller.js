import User from './user.model.js'

/*
 * alive (helper function)
 */
export async function alive (req, res) {
  if (req.body.username === 'somebody') {
    res.conflict('Username is already taken')
  }
  res.send({ message: 'alive' })
}

/*
 * create user
 */
export async function createUser (req, res) {
  try {
    const user = new User(req.body)
    user.resetDate = new Date()
    await user.save()
    res.code(201).send(user)
  } catch (err) {
    res.status(500).send({ statusCode: 500, message: err, })
  }
}

/*
 * get User collection
 */
export async function getUsers (req, res) {
  try {
    const users = await User.find({})
    res.code(200).send(users)
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * get single User
 */
export async function getUser (req, res) {
  try {
    const user = await User.findById(req.params.id)
    res.code(200).send(user)
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * update User by id
 */
export async function updateUser (req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) { res.notFound() }

    // do not Object.assign, becuse we want to control which fields are updated
    user.nickname = req.body.nickname || user.nickname
    user.email = req.body.email || user.email
    user.username = req.body.username || user.username
    user.email_verified = req.body.email_verified
    const updatedUser = await user.save()

    res.code(200).send(updatedUser)
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * delete User by Id
 */
export async function deleteUser (req, res) {
  try {
    await User.findByIdAndRemove(req.params.id)
    res.code(200).send()
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * validate username
 */
export async function validateUsername (req, res) {
  try {
    const user = await User.findOne({ username: req.params.username.trim() })
    if (user) {
      res.conflict('Username already taken')
    } else {
      res.code(200).send({ valid: true })
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * validate reset key
 */
export async function validateResetToken (req, res) {
  try {
    const user = await User.findOne({ resetKey: req.params.token.trim() })
    if (user) {
      res.code(200).send({ valid: true })
    } else {
      res.unauthorized('Reset token is invalid')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

/*
 * Reset password
 */
export async function resetPassword (req, res) {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    res.notFound('User not found')
    return false
  }
  user.setResetKey()
  user.active = false
  user.resetDate = new Date()
  await user.save()
  const response = { message: 'passwortWasResetSuccessfully' }

  // send key, email etc. in response, if we are in development mode
  if (process.env.NODE_ENV === 'development') {
    response.key = user.resetKey
    response.email = user.email
    response.env = process.env.NODE_ENV
    response.note = 'Reset key is only available in development mode response. In production it gets sent by email to the respective user.'
  }

  // send response
  res.send(response)
}

/*
 * Update Password
 */
export async function updatePassword (req, res) {
  const user = await User.findOne({ resetKey: req.body.token })
  if (!user) {
    res.unauthorized('Reset token is invalid')
    return false
  }
  user.active = true
  user.password = req.body.password.trim()
  user.passwordUpdated = new Date()
  user.resetDate = null
  user.setResetKey()
  await user.save()
  res.send({ message: 'password updated' })
}

/*
 * verify Email by token
 */
export async function verifyEmail (req, res) {
  const user = await User.findOne({ resetKey: req.params.token.trim() })
  if (!user) {
    res.unauthorized('Verify token is invalid')
    return false
  }
  user.email_verified = true
  user.active = true
  user.resetKey = null
  user.resetDate = null
  await user.save()
  res.send({ accountActive: true })
}

/*
 * login
 */
export async function login (req, res) {
  const user = await User.findOne({ username: req.body.username.trim() })
  if (!user) {
    res.unauthorized('Username or password invalid')
    return false
  }
  if (!user.active) {
    res.unauthorized('Account is not active')
    return false
  }
  if (!user.email_verified) {
    res.unauthorized('Email is not verified')
    return false
  }
  if (user.blocked) {
    res.unauthorized('Account is blocked')
    return false
  }
  const valid = await user.checkPassword(req.body.password)
  if (!valid) {
    res.unauthorized('Username or password invalid')
    return false
  }

  // @TODO generate token
  res.send({
    token: 'token for the user',
  })
}
