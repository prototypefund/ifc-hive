/*
 * route.system.fixtures resets the database
 *
 * This route drops the complete database, reads fixture-data from ./src/fixtures
 * and imports these fixtures as fresh state.
 */
import { S } from 'fluent-json-schema'
import User from '../../model/user/user.model.js'
import idMapEssentials from '#src/fixtures/idMapEssentials.js'
import idMapDevelopment from '#src/fixtures/idMapDevelopment.js'
import { defaultHeadersSchema } from '#src/lib/headersHelper.js'
import Users from '#src/fixtures/essentials/core_user.js'
import { v4 as uuidv4 } from 'uuid'

/*
 * This is or Look-up-table to convert human readble ID's in the fixutres data
 * to UUID's the database expects them.
 */
const ids = idMapEssentials.concat(idMapDevelopment)

/*
 * replace human-friendly placeholder IDs with actual UUID's
 * @param {array} objects - array of objectsw with human-friendly placeholder ID's
 * @param {object} id = the idMap with key value pairs for humand-friendly ID to UUIDv4
 */
function mapIds (objects, idLookup) {
  // early return if there is nothing to do
  if (!objects || !Array.isArray(objects) || objects.length < 1) return 
  // iterate over objects and replace the origina obj._id with the UUID from idLookup
  return objects.map((e) => { 
    e._id = idLookup[e._id]
    return e
  })
}

/*
 * Route definition 
 */
export default function (app) {
  
  const VERSIONS = ['1.0.0']

  /*
   * Handler
   */
  async function handler (request, response) {
    try { 
      const idMap = ids.reduce((acc,curr)=> (acc[curr] = uuidv4(), acc), {})
      const refUsers = JSON.parse(JSON.stringify(Users))
      // generate new uuids in idMap
      await User.deleteMany({})

      request.log.info(`Mongodb truncated collection ${User.collection.collectionName}`)
      const newUsers = mapIds(refUsers, idMap)
      newUsers.forEach(async function (u) {
        await User.create(u)
      })

      return { newUsers, idMap }
    } catch (err) {
      app.httpErrors.internalServerError(err)
    }
  }

  /* headers */
  const headers = defaultHeadersSchema (VERSIONS, VERSIONS.length -1) 

  /*
   * route definition
   */
  return {
    constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Load data fixtures (NOTE: deletes database)',
      description: `<strong>DELETES AND REINSTALLS THE COMPLETE DB</strong>. Dumps he database and loads data fixtures. `,
      tags: ['core/system'],
      headers,
      security: [ { apiKey: [] } ],
    }
  }
}
