import { customAlphabet } from 'nanoid'
const customCyperAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/*
 * randomId genertor
 *
 * @param {number} length - required length for the output
 * @return {object} - nanoid instance
 * @example
 * randomId(12) => 'gdh6326GDJh0'
 * 
 * Use it for socket-id's, token-id's, reset-tokens etc. Everywhere wehere we
 * want ao unique, random string which doesn't have to be UUID.
 */

export function randomIdGenerator (length = 16) {
  return customAlphabet(customCyperAlphabet, length )
}

/*
 * Update deep object by string path 
 *
 * @param {object} obj - the object to be updated
 * @param {string} path - the path to the property
 * @value {mixed} value - the value to be set
 * @return {object} - a brand new object with the updated path
 */
export function updateDeepObjectByPath (obj, path, value) {
  const [head, ...rest] = path.split('.')
  return {
    ...obj,
    [head]: rest.length
    ? setProperty(obj[head], rest.join('.'), value)
    : value
  }
}

/*
 * @patm  
 * 
 * const obj = {
 *  first: { deep: { path: 'find me' } },
 *  second: [1, 2, { a: 'target' }]
 *  }
 * get(obj, 'first.deep.path', 'second[0]', 'second[2].a');
 * // => ['find me', 1, 'target']
 */
 export function getNestedPropertyByPath (obj, ...selectors) {
  return [...selectors].map(s =>
    s
    .replace(/\[([^\[\]]*)\]/g, '.$1.')
    .split('.')
    .filter(t => t !== '')
    .reduce((prev, cur) => prev && prev[cur], obj)
  )
}
