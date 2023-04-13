/*
 * route system delete all Elasticsearch indices
 */
import * as esManage from '#src/lib/es/manage.js'

export default function (app) {

  async function handler (req, res) {
    try {
      return { msg: 'something' }
      // const requiredIndices = await esManage.getRequiredIndices()
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
      summary: 'Build all indices anew',
      description: `This endpoint assumes.`,
      tags: ['core/system'],
      security: [ { apiKey: [] } ],
    }
  }
}

