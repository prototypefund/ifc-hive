

/*
 * Get indices
 */
const getIndices = async () => {
  indices = await client.cat.indices() // get indices
    .split('\n') // turn lines into array
    .map(c => c.split(' ')[2]) // get 3rd column of array which holds the index name
}

/*
 * reports missing indices
 */
const checkForMissingIndices = async ({ project, tag, user, tickets }) => {
}

/*
 * create missing indices
 */
const createMissingIndices = async (missing) => {
}

/*
 * get some basic information about the es system to report for the
 * sake of system administration
 */
this.getStats = async () => {
}

export default esManager
