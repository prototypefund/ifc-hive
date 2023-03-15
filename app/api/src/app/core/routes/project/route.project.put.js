import { S } from 'fluent-json-schema'
import { projectSchema, projectResponseSchema } from '../../model/project/project.schema.js'

export default function (app) {

  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'objectUpdated',
      token: request.user,
    })  
  }

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return  {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Update a project.',
      description: ``,
      tags: ['core/project'],
      body: projectSchema,
      params,
      response: {
        '2xx': projectResponseSchema
      },
      security: [ { apiKey: [] } ],
    }
  }
}

