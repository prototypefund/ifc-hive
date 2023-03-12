import t from 'tap'
import * as h from '../../src/lib/helpers.js'

/*
 * randomIdGenerator
 */
t.test('randomIdGenerator', (t) => {
  t.equal(
    h.randomIdGenerator(22)().length,
    22,
    'generates a unique id with a desired length'
  )
  t.end()
})

/*
 * updateDeepObjectByPath
 */
t.test('updateDeepObjectByPath', (t) => {
  const input = { a: { b: { c: 'originalValue' } } }
  const expected = { a: { b: { c: 'newValue' } } }
  const path = 'a.b.c'
  t.same(
    h.updateDeepObjectByPath(input, path, 'newValue'),
    expected,
    'updates a nested object given a path and a value.'
  )

  t.equal(
    h.updateDeepObjectByPath(input, 'a', 'flatUpdate').a,
    'flatUpdate',
    'updates a flat object given a path and a value'
  )

  t.end()
})

/*
 * getNestedPropertyByPath
 */
t.test('getNestedPropertyByPath', (t) => {
  const input = {
    first: { deep: { path: 'find me' } },
    second: [1, 2, { a: 'target' }]
  }
  const expected = ['find me', 1, 'target']

  t.equal(
    h.getNestedPropertiesByPath(input, 'second[0]' )[0],
    1,
    'returns an array with a single value when asked for a single path'
  )

  t.same(
    h.getNestedPropertiesByPath(input, 'first.deep.path', 'second[0]', 'second[2].a'),
    expected,
    'returns an array with values when provided multiple paths '
  )

  t.end()
})

/*
 * extractId
 */
t.test('extractId', (t) => {
  const expected = '1234'
  t.equal( h.extractId('1234'), '1234', 'returns the value when given a string')
  t.equal( h.extractId( { _id: '1234' }), '1234', 'finds the _id attribute ')
  t.equal( h.extractId( { id: '1234' }), '1234', 'finds the id attribute ')
  t.equal( h.extractId( { Id: '1234' }), '1234', 'finds the Id attribute ')
  t.equal( h.extractId( { ID: '1234' }), '1234', 'finds the ID attribute ')
  t.notOk( h.extractId(13), 'returns false if given an integer')
  t.notOk( h.extractId({ a: 1, b: 2 }), 'returns false when given an object with an id-field')

  t.end()
})

/*
 * isObject
 */
t.test('isObject', (t) => {
  t.notOk( h.isObject([1, 3]),'returns false when given an array')
  t.ok( h.isObject({ a: 1, b: 2 }), 'returns true when given an object')
  t.notOk( h.isObject('string' ), 'returns false when given a string')
  t.end()
})

/*
 * removeKeyFromObject
 */
t.test('removeKeyFromObject', (t) => {
  const input = { _id: '1234', name: 'my name', content: 'my content' }
  const expected = { name: 'my name', content: 'my content' }

  t.same(
    h.removeKeyFromObject(input, '_id' ),
    expected,
    'removes a given property in a flat object'
  )

  t.same(
    h.removeKeyFromObject('string'), 
    'string',
    'returns the given value when provided a string'
  )

  t.same(
    h.removeKeyFromObject(expected, '_id'),
    expected,
    'copies th input when passed an object without the key in question'
  )

  const input2 = {
    _id: '1234',
    name: 'my name',
    content: 'my content',
    nested: { _id: '1234', nested: 'nested' }
  }
  const expected2 = {
    name: 'my name',
    content: 'my content',
    nested: { nested: 'nested' }
  }

  t.same(
    h.removeKeyFromObject( input2, '_id'),
    expected2,
    'removes recursively all attribues wiith the given key'
  )

  t.end()
})
t.end()
