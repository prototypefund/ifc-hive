/*
 * Data object helpers
 * Since the primary data objects are handled with ever recurring patterns the
 * functions in this file should make live easier.
 *
 */
import S from 'fluent-json-schema'

const dataPayloadSchema = S.object()
  .prop('_account', S.mixed['string', 'null'] )
  .prop('_createdAt', S.mixed['data', 'null'] )
  .prop('_deleted', S.boolean())
  .prop('_id', S.string().format('uuid') )
  .prop('_path', S.mixed['string', 'null'] )
  .prop('_project', S.mixed['string', 'null'] )
  .prop('_source', S.object() )
  .prop('_title', S.mixed['string', 'null'] )
  .prop('_type', S.mixed['string', 'null'] )
  .prop('_updatedAt', S.mixed['data', 'null'] )
  .required(['_id'])

/*
 * createDataPayload
 */
function createDataPayload (opts)  {
  const defaults = {
    _account: null,
    _createdAt: null,
    _deleted: null,
    _id: null,
    _path: null,
    _project: null,
    _source: {},
    _title: null,
    _type: null,
    _updatedAt: null,
  } 
  const payload = { ...defaults, ...opts }

  // validate data payload 

  return payload
}

function createTicketPayload (ticket) {
  return {
    _id: ticket._id,
    _account: null,
    _createdAt: ticket.createAt,
    _updatedAt: ticket.updatedAt,
    _deleted: ticket.isDeleted,
    _project: ticket.project,
    _path: ticket.path,
    _source: ticket,
    _title: ticket.title,
    _type: 'ticket',
    _disId: ticket.disId,
  }
}

function createUserPayload (user) {
  return {
    _account: user.account, 
    _createdAt: user.createdAt,
    _updatedAt: user.updatedAt,
    _deleted: user.isDeleted,
    _project: null,
    _path: null,
    _source: user,
    _title: `${firstname} ${lastname} ${nickname} ${email}`,
    _type: 'user',
    _disId: user.nickname,
  }
}

const payloadFabric = {
  ticket: createTicketPayload,
  user: createUserPayload,
}


/*
 * validateDataPayload
 * validate payload object with dataObjectSchema
 */
function validateDataPayload () {

}

export {
  createDataPayload,
  validateDataPayload,
  dataPayloadSchema, 
  payloadFabric, // use the payloadFabric map
  createTicketPayload,
  createUserPayload,
}

