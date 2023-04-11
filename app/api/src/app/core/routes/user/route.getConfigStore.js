import { S } from 'fluent-json-schema'
import { configStoreSchema } from '../../model/configStore/configStore.schema.js'
import { ConfigStore, configTypes } from '../../model/configStore/configStore.model.js'

export default function (app) {
  async function handler (req, res) {
    try {
      const filter = { user: req.user._id }
      const { project, type, title, id } = req.query

      // add optional filters
      if (project) filter.project = project
      if (type) filter.type = type
      if (title) filter.title = title
      if (id) filter._id = id

      const configs = await ConfigStore.find(filter).limit(50)
      return configs

    } catch (err) {
      app.httpErrors.internalServerError()
      app.log.error({ msg: 'Error route.configStore.get', err })
    }
  }

  const querystring = S.object()
    .prop('id', S.string().description('config ID (not user ID)'))
    .prop('project', S.string().description('project ID'))
    .prop('typ', S.string().enum(configTypes).description('Configuration type'))
    .prop('title', S.string().description('custom title as previously saved'))

  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Create or update a config object',
      tags: ['core/user'],
      security: [ { apiKey: [] } ],
      querystring,
      response: {
        '2xx': S.array(),
      }
    },

  }
}
