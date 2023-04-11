import proxymise from 'proxymise'

const esManager = function (client) {  

  let indices = [];
  let expectedIndices = [ 'tag', 'project', 'user' ]; // extend with project ticket indices
  let createdIndices = [];
  let stats = {};

  /*
   * Get indices
   */
  this.getIndices = async () => {
    indices = await client.cat.indices() // get indices
      .split('\n') // turn lines into array
      .map(c => c.split(' ')[2]) // get 3rd column of array which holds the index name
    return this
  }

  /*
   * reports missing indices
   */
  this.checkForMissingIndices = async ({ project, tag, user, tickets }) => {
    return this 
  }

  /*
   * create missing indices
   */
  this.createMissingIndices = async (missing) => {
    return this
  }

  /*
   * get some basic information about the es system to report for the
   * sake of system administration
   */
  this.getStats = async () => {
    return this
  }
}

export default proxymise(new esManager)
