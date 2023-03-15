/*
 * project remove route
 */
import { S } from 'fluent-json-schema'
import { projectResponseSchema } from '../../model/project/project.schema.js'
import Project from '../../model/project/project.model.js'

export default function (app) {

  async function handler (request, response) {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: request.params.id }, 
        { isDeleted: true },
        { new: true })

      if (!project) return app.httpErrors.notFound()
      return  project 
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* params scheme */
  const params = S.object()
    .prop('id', S.string())


  /* route options */
  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Delete a project by id',
      tags: ['core/project'],
      security: [ { apiKey: [] } ],
      params,
      response: {
        '2xx': projectResponseSchema,
      }
    },
  }
}
