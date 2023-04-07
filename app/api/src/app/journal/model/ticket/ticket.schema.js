import { S } from 'fluent-json-schema'
import { createDataPayload } from '#src/lib/dataObjectHelpers.js'

/* ticket base schema */
const ticketSchema = S.object()
  .id('#ticket/base')
  .title('journal/ticket')
  .prop('_id', S.string().format('uuid')) 
  .prop('project', S.string().format('uuid'))
  .prop('meta', S.object())
  .prop('title', S.string())
  .prop('disId', S.string())
  .prop('owner', S.string().format('uuid'))
  .prop('assigned', S.array().items(S.string().format('uuid')))
  .prop('body', S.anyOf([S.object(), S.string(), S.null()]))
  .prop('closed', S.boolean())
  .prop('tags', S.array().items(S.string().format('uuid')))
  .prop('start', S.anyOf([S.string().format('date'), S.null()]) )
  .prop('due', S.anyOf([S.string().format('date'), S.null()]))
  .prop('expires', S.anyOf([S.string().format('date'), S.null()]))
  .prop('files', S.array().items(S.object()))
  .prop('links', S.array().items(S.object()))
  .prop('isDeleted', S.boolean())
  .required(['title'])

const ticketResponseSchema = ticketSchema


/* @TODO auto generate from schema */
const ticketObjectTemplate = {
  _id: null,
  project: null,
  meta: {},
  title: null,
  disId: null,
  owner: null,
  assigned: [],
  body: null,
  closed: false,
  tags: [],
  start: null,
  due: null,
  expires: null,
  files: [],
  links: [],
  isDeleted: false
}


const ticketTemplate = createDataPayload({ _source: ticketObjectTemplate })

const ticketJsonSchema = ticketSchema.valueOf()

export default ticketSchema
export {
  ticketSchema,
  ticketResponseSchema,
  ticketTemplate, 
  ticketJsonSchema,
}
