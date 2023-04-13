import Project from '../../app/core/model/project/project.model.js'
import tagMapping from '../../app/core/model/tag/tag.esmap.js'
import projectMapping from '../../app/core/model/project/project.esmap.js'
import userMapping from '../../app/core/model/user/user.esmap.js'
import ticketMapping from '../../app/journal/model/ticket/ticket.esmap.js'

/*
 * lookup map for object mappings
 */
const mapping = {
  project: projectMapping,
  user: userMapping,
  tag: tagMapping,
  ticket: ticketMapping,
}

/*
 * get required indices
 */
async function getRequiredIndices () {
  // const default = ['tag', 'project', 'user']
  const projects = await Project.find().select('_id code')
  const defaultIndices = ['tag', 'project', 'user']
  const requiredIndices = [...defaultIndices, ...projects.map(p => `ticket_${p._id}`)]

  return requiredIndices
}

/*
 * Get existing indices
 */
async function getIndices (client) {
  const indices = await client.cat.indices() // get indices
    //
  return indices
    .split('\n') // turn lines into array
    .map(c => c.split(' ')[2]) // get 3rd column of array which holds the index name
    .slice(0, -1) // the array return string contains an emtpy line
    .sort()
}

/*
 * check for missing indices
 * @return {array} - array with required but missing indices
 */
async function checkForMissingIndices (requiredIndices, availableIndices) {
  // early return to nothing if one of the parameters is not an array
  if (!Array.isArray(availableIndices) || !Array.isArray(requiredIndices)) return []
  // // loop over required indices and theck if it exists
  const missing = []
  requiredIndices.forEach((r) => {
    if (!availableIndices.includes(r)) {
      missing.push(r)
    }
  })
  return missing
}

/*
 * create missing indices
 */
async function createMissingIndices (client, missing) {
  // loop over missing indices and create with correct mapping
  missing.forEach(async (m) => {
    const indexDefinition = {
      index: m,
      mappings: mapping[m.split('_')[0]] // get mapping based on first segment of index name
    }
    client.indices.create(indexDefinition)
  })
}

/*
 * get some basic information about the es system to report for the
 * sake of system administration
 */
async function getStats (requestedIndices) {
  // early return  conditions
  if (!requestedIndices || !Array.isArray(requestedIndices) || requestedIndices.length < 1)
    return false

  // loop over requested indices and create
}


/*
 * create index
 */
async function createIndex (client, index, mappings) {
  return await client.indices.create({ index, mappings })
}

// /*
//  * delete given index
//  */
// async function deleteIndex (client, index) {
//   return await client.indices.delete({ index })
// }

/*
 * delete all indices
 */
// async function deleteAllIndices (client, indices) {
//
// }
//
// /*
//  * index a single document
//  */
// async function indexDoc (client, obj, esmapper, index) {
//   return await client.index({
//     index,
//     id: obj._id,
//     refresh: true,
//     body: esmapper(obj) 
//   })
// }

/*
 * index multiple documents
 *
 * Use this method when indexing whole collections, e.g. in conjunction 
 * with paging through the mongo collection.
 */
// async function batch (client, objects, esmapper, index) {
//
// }

export {
  getRequiredIndices,
  getIndices,
  checkForMissingIndices,
  createMissingIndices,
  getStats,
  createIndex,
  // indexDoc,
}
