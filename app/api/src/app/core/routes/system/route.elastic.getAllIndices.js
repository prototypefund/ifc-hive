/*
 * route system delete all Elasticsearch indices
 */
import * as esManage from '#src/lib/es/manage.js'

export default function (app) {

  async function handler (req, res) {
    try {
      // const requiredIndices = await esManage.getRequiredIndices()
      return await esManage.getIndices(app.es)
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
      summary: 'Get all existing search indices',
      description: `Use this API endpoint to get all existing indices.`,
      tags: ['core/system'],
      security: [ { apiKey: [] } ],
    }
  }
}

