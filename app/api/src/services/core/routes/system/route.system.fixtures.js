/*
 * route.system.fixtures resets the database
 *
 * This route drops the complete database, reads fixture-data from ./src/fixtures
 * and imports these fixtures as fresh state.
 */
import idMapEssentials from '#src/fixtures/idMapEssentials.js'
import idMapDevelopment from '#src/fixtures/idMapDevelopment.js'
import { defaultHeadersSchema } from '#src/lib/headersHelper.js'
import User from '../../model/user/user.model.js'
import Users from '#src/fixtures/essentials/core_user.js'
import Organization from '../../model/organization/orga.model.js'
import Orgas from '#src/fixtures/essentials/core_organization.js'
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
function mapIds (objects, idLookup, fields = ['_id']) {
  // early return if there is nothing to do
  if (!objects || !Array.isArray(objects) || objects.length < 1) return 
  // iterate over objects and replace the origina obj._id with the UUID from idLookup
  return objects.map((e) => { 
    fields.forEach((f) => { e[f] = idLookup[e[f]] })
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

      
      // create a fresh idMap
      const idMap = ids.reduce((acc,curr)=> (acc[curr] = uuidv4(), acc), {})

      /* import organizations */
      const refOrgas = JSON.parse(JSON.stringify(Orgas))
      await Organization.deleteMany()
      const newOrgas = mapIds(refOrgas, idMap)
      await Organization.insertMany(newOrgas)
      
      /* import users */
      const createPromises = []
      const refUsers = JSON.parse(JSON.stringify(Users)) // clone user fixtures
      await User.deleteMany({}) // truncate user collection
      const newUsers = mapIds(refUsers, idMap, ['_id','organization']) // map _id fields
      // cretae users, note that inserMany does not call the preSave hook,
      // which we need when saving new users
      newUsers.forEach(async function (u) {
        createPromises.push(User.create(u))
      })
      // create all user documents
      await Promise.all(createPromises)

      return {
        organizationCount: await Organization.countDocuments(),
        userCount: await User.find()
      }

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
