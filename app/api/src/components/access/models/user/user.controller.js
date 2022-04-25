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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (req.body.password) {
      user.passwordUpdated = new Date()
      await user.save()
    }
    res.code(200).send(user)
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

export async function resetPassword (req, res) {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    res.notFound('User not found')
  }
  res.send({ message: 'reset password' })
}
