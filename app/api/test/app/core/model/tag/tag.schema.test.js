import t from 'tap'
import { tagSchema } from '#src/app/core/model/tag/tag.schema.js'
import Ajv from 'ajv'
import  addFormats from 'ajv-formats'
import { v4 as uuidv4 } from 'uuid'

const ajv = new Ajv()
addFormats(ajv)

const uuid = uuidv4()

const validateTagSchema = ajv.compile(tagSchema.valueOf())

t.test('tagSchema', (t) => {

  const validTag = {
    _id: uuid,
    project: uuid,
    title: 'my title',
    type: 'time',
    locked: true,
  }

  const noUuid = {
    _id: 'asdf',
    project: uuid,
    title: 'my title'
  }
  const noTitle = {
    _id: 'asdf',
    project: uuid,
  }

  const noProject = {
    _id: uuid,
    title: 'sometitle',
  }

  t.ok(validateTagSchema(validTag), 'validates a tag with _id and title' ) 
  t.notOk(validateTagSchema(noTitle), 'throws error when title is missing')
  t.notOk(validateTagSchema(noUuid), 'throws error when _id is not a UUID')
  t.notOk(validateTagSchema(noProject), 'throws error when project is missing')

  t.end()
})
