import t from 'tap'

t.test('Some first test suite', t => {
  t.test('A second level of description', t => {
    t.pass('This is true')
    t.equal('2', '2')
    t.equal(3, 3)
    t.end()
  })
  t.end()
})

t.test('Array.indexOf', t => {
  const array = [1, 2, 3]
  t.test('when item is not found', t => {
    t.test('does not throw an error', t => {
      array.indexOf(4)
      t.end()
    })
    t.equal(array.indexOf(4), -1, 'returns -1')
    t.end()
  })
  t.end()
})
