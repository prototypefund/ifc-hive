import { S } from 'fluent-json-schema'
import { configStoreSchema } from '../../model/configStore/configStore.schema.js'
import ConfigStore from '../../model/configStore/configStore.model.js'
import { v4 as uuidv4 } from 'uuid'

export default function (app) {
  async function handler (req, res) {
    try {
      const  _id = req.params.id
      let config
      req.body.user = req.user._id

      if (_id) {
        delete req.body._id
        config = await ConfigStore.findOneAndUpdate({ _id }, req.body, { new: true })
      }

      if (!_id && !req.body._id) {
        req.body._id = uuidv4()
      }

      if (!config) {
        config = await ConfigStore.create(req.body)
      }

      return config
      // return req.body
    } catch (err) {
      app.httpErrors.internalServerError()
      app.log.error({ msg: 'Error route.configStore.put', err })
    }
  }

  const params = S.object()
    .prop('id', S.string())

  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Create or update a config object',
      tags: ['core/user'],
      security: [ { apiKey: [] } ],
      params,
      body: configStoreSchema.without(['user']),
      response: {
        '2xx': configStoreSchema,
      }
    },

  }
}
