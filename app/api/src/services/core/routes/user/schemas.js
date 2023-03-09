import { S } from 'fluent-json-schema'

/*
 * User Base Schema
 */
export const userBaseSchema = S.object()
  .id('#user/base')
  .title('User Base Schema')
  .prop('_id', S.string().format('uuid').examples(['18a0e5f5-6426-4ce3-8a87-29792eb129a5']))
  .prop('firstname', S.string().examples(['Ted']))
  .prop('lastname', S.string().examples(['Tester']))
  .prop('nickname', S.string().examples(['Teddy']))
  .prop('email', S.string().format(S.FORMATS.EMAIL).examples(['teddy@example.com']))
  .prop('organisation',S.string())
  .prop('password', S.string())
  .prop('active', S.boolean())
  .prop('tags', S.array().items(S.string()))
  .prop('resetkey', S.string())
  .prop('created', S.string().examples([new Date()]))
  .prop('updated', S.string().examples([new Date()]))
  .required(['email', 'nickname'])

export const userResponseSchema = userBaseSchema.without(['password', 'resetkey'])

export const userAvatar = S.object()

export const userOrganization = S.object()


