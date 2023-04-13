/*
 * route system delete all Elasticsearch indices
 */
import * as esManage from '#src/lib/es/manage.js'

export default function (app) {

  async function handler (req, res) {
    try {
      // const requiredIndices = await esManage.getRequiredIndices()
      const indices = await esManage.getIndices(app.es)
      const deleted = {}

      for (const i of indices) {
        const res = await app.es.indices.delete({ index: i })
        deleted[i] = res
      }
      
      return deleted

    } catch (err) {
      app.httpErrors.internalServerError(err)
      app.log.error(err)
    }
  }

  return {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Delete and recreate all existing elasticsearch indices',
      description: `<strong>DELETES  ALL SEARCH INDICES!</strong>. This route
      is mainly meant for developemt. In production only individual indices
      shoulb be rebuild.`,
      tags: ['core/system'],
      security: [ { apiKey: [] } ],
    }
  }
}

