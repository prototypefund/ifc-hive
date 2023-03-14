import { S } from 'fluent-json-schema'

/*
 * User Base Schema
 */
export const userBaseSchema = S.object()
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
  .prop('resetkey', S.string())
  .prop('created', S.string().examples([new Date()]))
  .prop('updated', S.string().examples([new Date()]))
  .required(['email', 'nickname'])

export const userResponseSchema = userBaseSchema.without(['password', 'resetkey'])


