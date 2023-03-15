import { S } from 'fluent-json-schema'
import { tagResponseSchema } from '../../model/tag/tag.schema.js'
import Project from '../../model/project/project.model.js'

export default function (app) {

  async function handler (request, response) {
    try {
      const projects = await Project.find()
      if (!projects || projects.length === 0) return response.code(204)
      return { projects }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  return {
    handler,
    schema: {
      summary: 'Get all projects',
      tags: ['core/project'],
      security: [ { apiKey: [] } ],
    }
  }
  
}
