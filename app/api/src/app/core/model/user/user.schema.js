import { S } from 'fluent-json-schema'
import { createDataPayload } from '#src/lib/dataObjectHelpers.js'

/*
 * User Base Schema
 */
const userSchema = S.object()
  .id('#user/base')
  .title('core/user')
  .prop('_id', S.string().format('uuid').examples(['18a0e5f5-6426-4ce3-8a87-29792eb129a5']))
  .prop('nickname', S.string().examples(['Teddy']))
  .prop('email', S.string().format(S.FORMATS.EMAIL).examples(['teddy@example.com']))
  .prop('title', S.string().examples(['Dr.', 'Count', 'Dutchess', 'Dictator']))
  .prop('firstname', S.string().examples(['Ted']))
  .prop('lastname', S.string().examples(['Tester']))
  .prop('email_verified', S.boolean())
  .prop('active', S.boolean())
  .prop('blocked', S.boolean())
  .prop('password', S.string())
  .prop('organisation',S.string())
  .prop('tags', S.array().items(S.string()))
  .prop('createdAt', S.string().examples([new Date()]))
  .prop('updatedAt', S.string().examples([new Date()]))
  .prop('isDeleted', S.boolean())
  .required(['email', 'nickname'])

const userResponseSchema = userSchema.without(['password', 'resetkey'])
const userLoginSchema = userSchema.only(['password'], 'email')
const userSignUpSchema = userSchema.without(['active','blocked', 'createdAt', 'updatedAt', 'isDeleted', 'email_verified'] )

const userObjectTemplate = {
  _id: null,
  nickname: null, 
  email: null,
  title: null,
  firstname: null,
  lastname: null, 
  email_verified: null, 
  active: null,
  blocked: null, 
  password: null, 
  organization: null, 
  account: null,
  tags: [],
}

/* template */
const userTemplate = createDataPayload({ _source: userObjectTemplate })

/* Json schema */
const userJsonSchema = userSchema.valueOf()


export default userSchema 
export {
  userSchema,
  userResponseSchema, 
  userLoginSchema,
  userTemplate, 
  userJsonSchema,
}
