/*
 * route.system.fixtures resets the database
 *
 * This route drops the complete database, reads fixture-data from ./src/fixtures
 * and imports these fixtures as fresh state.
 */
import { v4 as uuidv4 } from 'uuid'
import idMapEssentials from '#src/fixtures/idMapEssentials.js'
import idMapDevelopment from '#src/fixtures/idMapDevelopment.js'
import { mapIds } from '#src/lib/helpers.js'
import { S } from 'fluent-json-schema'

// random text sample for the large dummy project
import randomText from '#src/fixtures/randomText.js'

// get model definition and associated fixture data
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

/*
 * This is our Look-up-table to convert human readble ID's in the fixutres data
 * to UUID's the database expects them.
 */
const ids = idMapEssentials.concat(idMapDevelopment)

/* Route definition */
export default function (app) {
  
  const VERSIONS = ['1.0.0']

  /*
   * Handler
   */
  async function handler (request, response) {
    try { 
      // set dummyTicketsCount from query string parameter
      const dummyTicketsCount = parseInt(request.query.dummyTicketsCount) || 1000

      // create a fresh idMap
      const idMap = ids.reduce((acc,curr)=> (acc[curr] = uuidv4(), acc), {})

      /* import organizations */
      const refOrgas = JSON.parse(JSON.stringify(orgas))
      await Organization.deleteMany()
      const newOrgas = mapIds(refOrgas, idMap)
      await Organization.insertMany(newOrgas)

      /* import accounts */
      const refAccounts = JSON.parse(JSON.stringify(accounts))
      await Account.deleteMany()
      const newAccounts = mapIds(refAccounts, idMap, ['_id', 'organization' ])
      await Account.insertMany(newAccounts)
      
      /* import users */
      const createPromises = []
      const refUsers = JSON.parse(JSON.stringify(users)) // clone user fixtures
      await User.deleteMany({}) // truncate user collection
      const newUsers = mapIds(refUsers, idMap, ['_id','organization', 'account']) // map _id fields
      // cretae users, note that inserMany does not call the preSave hook,
      // which we need when saving new users
      newUsers.forEach(async function (u) {
        createPromises.push(User.create(u))
      })
      // create all user documents
      await Promise.all(createPromises)

      /* import projects */
      const refProjects = JSON.parse(JSON.stringify(projects))
      await Project.deleteMany()
      const newProjects = mapIds(refProjects, idMap, ['_id', 'account', 'journal' ])
      await Project.insertMany(newProjects)

      /* import tags */
      const refTags = JSON.parse(JSON.stringify(tags))
      await Tag.deleteMany()
      const newTags = mapIds(refTags, idMap, ['_id' , 'project'])
      await Tag.insertMany(newTags)

      /* import permissions */
      const refPermissions = JSON.parse(JSON.stringify(permissions))
      await Permission.deleteMany()
      const newPermissions = mapIds(refPermissions, idMap, ['_id', 'subjectId', 'objectId'])
      Permission.insertMany(newPermissions)
      

      /* import tickets */
      try {
        // import tickets
        const refTickets = JSON.parse(JSON.stringify(tickets)) // make a clean copy of fixtures
        const newTickets = mapIds(refTickets, idMap, ['_id', 'parent', 'project', 'owner', 'tags'])
        const savedTickets = [] // container to keep reference for newly saved tickets
        await Ticket.deleteMany() // clear ticket collection

        // iterate over ticket fixtures and add
        // @NOTE we can't use insertMany due to the recursive tree operations
        for (const t of newTickets) {
          savedTickets.push(await Ticket.create(t))
        }

        // dummy project with auto generated tickets for stress test
        const dummyRoot = savedTickets.pop()
        // generate dummy tickets objects
        const dummyTicketsRaw = [...Array(dummyTicketsCount)].map((_, i) => {
          const t = JSON.parse(JSON.stringify(tickets[0]))
          t._id= uuidv4()
          t.disId = `${i}` 
          t.project = 'projectDummy'
          t.owner = 'userAnton',
          t.title = `${i} some random title with a prefix number`
          t.body = randomText
          t.parent = dummyRoot._id
          t.path = `${dummyRoot._id}#${t._id}`
          return t 
        })
        //  map id's in dummy tickets
        const dummyTickets = mapIds(dummyTicketsRaw, idMap, ['project', 'owner', 'tags'])
        // save all dummy tickets. Because of the simple dummy structure we can use insertMany()
        await Ticket.insertMany(dummyTickets)

        /* send response with object counts by type */
        return {
          accounts: await Account.countDocuments(),
          organizations: await Organization.countDocuments(),
          permissions: await Permission.countDocuments(),
          projects: await Project.countDocuments(),
          tags: await Tag.countDocuments(),
          tickets: await Ticket.countDocuments(),
          user: await User.countDocuments(),
        }
      } catch (error) {
        console.log(err)
      }
    } catch (err) {
      app.httpErrors.internalServerError(err)
    }
  }

  const querystring = S.object()
    .prop('dummyTicketsCount', S.number().default(1000))

  /*
   * route definition
   */
  return {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Load data fixtures (NOTE: deletes database)',
      description: `<strong>DELETES AND REINSTALLS THE COMPLETE DB</strong>. Dumps he database and loads data fixtures. `,
      tags: ['core/system'],
      security: [ { apiKey: [] } ],
      querystring,
    }
  }
}
