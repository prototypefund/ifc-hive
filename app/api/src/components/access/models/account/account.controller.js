import Account from './account.model.js'

/*
 * create account
 */
export async function createAccount (req, res) {
  const account = new Account(req.body)
  try {
    await account.save()
    res.status(201).send(account)
  } catch (error) {
    res.status(400).send(error)
  }
}
