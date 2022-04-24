import t from 'tap'
import * as h from '../../src/lib/schemaHelpers.js'

t.test('removeIdProperty(doc)', (t) => {
  const schema = { _id: '1234', name: 'my name', content: 'my content' }
  const expectedResult = { name: 'my name', content: 'my content' }

  t.test('should remove _id property from a simple object', (t) => {
    t.same(h.removeIdProperty(schema), expectedResult, 'removes _id property')
    t.end()
  })

  t.test('should return false when not provided an object', (t) => {
    t.notOk(h.removeIdProperty('string'), 'no object but string')
    t.end()
  })

  t.test('should return false when no _id field is present', (t) => {
    t.notOk(h.removeIdProperty(expectedResult), 'no _id field')
    t.end()
  })

  // t.test('shoult remove all _id fields from nested object', (t) => {
  //   const nestedSchema = {
  //     _id: '1234',
  //     name: 'my name',
  //     content: 'my content',
  //     nested: { _id: '1234', nested: 'nested' }
  //   }
  //   const expectedResult = {
  //     name: 'my name',
  //     content: 'my content',
  //     nested: { nested: 'nested' }
  //   }
  //
  //   t.same(h.removeIdProperty(nestedSchema), expectedResult, 'removes _id property')
  //   t.end()
  // })

  t.end()
})
t.end()
