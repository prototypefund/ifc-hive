/*
 * This file is a simple test to make sure the vitest library is correctly
 * integrated and configured so we can write our unit and component test.
 */
const user = {
  name: 'Bob',
  age: 22,
}

test('Bob is 22', () => {
  expect(user.name).toBe('Bob')
  expect(user.age).toBe(22)
})
