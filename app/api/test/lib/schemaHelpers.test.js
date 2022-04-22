import t from 'tap'
import * as h from '../../src/lib/schemaHelpers.js'

t.test('schemaHelper', (t) => {
  t.test('should remove _id property from simpel object', (t) => {
    const schema = { _id: '1234', name: 'my name', content: 'my content' }
    const expectedResult = { name: 'my name', content: 'my content' }
    t.same(h.removeIdProperty(schema), expectedResult, 'removes _id property')
    t.end()
  })
  t.end()
})
