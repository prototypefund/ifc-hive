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
import users from '#src/fixtures/essentials/core_user.js'
import Account from '../../model/account/account.model.js'
import accounts from '#src/fixtures/essentials/core_account.js'
import Organization from '../../model/organization/orga.model.js'
import orgas from '#src/fixtures/essentials/core_organization.js'
import Tag from '../../model/tag/tag.model.js'
import tags from '#src/fixtures/essentials/core_tag.js'
import Project from '../../model/project/project.model.js'
import projects from '#src/fixtures/essentials/core_project.js'
import Permission from '../../model/permission/permission.model.js'
import permissions from '#src/fixtures/essentials/core_permission.js'
import tickets from '#src/fixtures/essentials/journal_ticket.js'
import Ticket from '../../../journal/model/ticket/ticket.model.js'
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
    fields.forEach((f) => { if (e[f]) { e[f] = idLookup[e[f]] } })
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
      const refOrgas = JSON.parse(JSON.stringify(orgas))
      await Organization.deleteMany()
      const newOrgas = mapIds(refOrgas, idMap)
      await Organization.insertMany(newOrgas)
      
      /* import users */
      const createPromises = []
      const refUsers = JSON.parse(JSON.stringify(users)) // clone user fixtures
      await User.deleteMany({}) // truncate user collection
      const newUsers = mapIds(refUsers, idMap, ['_id','organization']) // map _id fields
      // cretae users, note that inserMany does not call the preSave hook,
      // which we need when saving new users
      newUsers.forEach(async function (u) {
        createPromises.push(User.create(u))
      })
      // create all user documents
      await Promise.all(createPromises)

      /* import accounts */
      const refAccounts = JSON.parse(JSON.stringify(accounts))
      await Account.deleteMany()
      const newAccounts = mapIds(refAccounts, idMap, ['_id', 'owner', 'organization' ])
      await Account.insertMany(newAccounts)

      /* import tags */
      const refTags = JSON.parse(JSON.stringify(tags))
      await Tag.deleteMany()
      const newTags = mapIds(refTags, idMap, ['_id' ])
      await Tag.insertMany(newTags)

      /* import projects */
      const refProjects = JSON.parse(JSON.stringify(projects))
      await Project.deleteMany()
      const newProjects = mapIds(refProjects, idMap, ['_id' ])
      await Project.insertMany(newProjects)

      /* import permissions */
      const refPermissions = JSON.parse(JSON.stringify(permissions))
      await Permission.deleteMany()
      const newPermissions = mapIds(refPermissions, idMap, ['_id', 'subjectId', 'objectId'])
      Permission.insertMany(newPermissions)

      
      const refTickets = JSON.parse(JSON.stringify(tickets))
      const newTickets = mapIds(refTickets, idMap, ['_id', 'parent'])

      try {

        await Ticket.deleteMany()

        // @TODO write function to iterate over promises and force sequential resolution as
        // we need the parent to exist when we instert the child
        const t0 = new Ticket(newTickets[0])
        await t0.save()
        const t1 = new Ticket(newTickets[1])
        await t1.save()
        const t2 = new Ticket(newTickets[2])
        await t2.save()
        const t3 = new Ticket(newTickets[3])
        await t3.save()
        const t4 = new Ticket(newTickets[4])
        await t4.save()
        const t5 = new Ticket(newTickets[5])
        await t5.save()
        const t6 = new Ticket(newTickets[6])
        await t6.save()

        /*
         * send response with object counts
         */
        return {
          organizations: await Organization.countDocuments(),
          user: await User.countDocuments(),
          accounts: await Account.countDocuments(),
          tags: await Tag.countDocuments(),
          projects: await Project.countDocuments(),
          permissions: await Permission.countDocuments(),
          tickets: await Ticket.getChildrenTree({ rootDoc: t0 }),
        }

      } catch (error) {
        console.log(err)
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
