import { S } from 'fluent-json-schema'
// import { projectSchema, projectResponseSchema } from '../../model/project/project.schema.js'
import Project from '../../model/project/project.model.js'

/*
 * Put project 
 */
export default function (app) {

/*
 * @TODO at the moment all projects get the provided config saved into their
 * settings. this is currently for developer convenience during development.
 */

  /* handler */
  async function handler (req, response) {
    // load all projects
    
    try {

      // get projectss
        await Project.updateMany({}, { $set: { 'config.browser': req.body } }) 
        const project = await Project.find().limit(1)

        return response.send({
          message: 'configUpdated',
          config: project[0].config.browser
        })  
    } catch (err) {
      app.httpErrors.internalServerError()
      app.log.error(err)
    }
  }

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return  {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Update the configuration of a project.',
      description: ``,
      tags: ['core/project'],
      params,
      security: [ { apiKey: [] } ],
    }
  }
}

