/*
 * Miscellaneous helper function
 */
import { customAlphabet } from 'nanoid'
import { deleteKey } from 'object-delete-key'
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
    ? updateDeepObjectByPath(obj[head], rest.join('.'), value)
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
 * getNestedPropertyByPath(obj, 'first.deep.path', 'second[0]', 'second[2].a');
 * // => ['find me', 1, 'target']
 */
 export function getNestedPropertiesByPath (obj, ...selectors) {
  return [...selectors].map(s =>
    s
    .replace(/\[([^\[\]]*)\]/g, '.$1.')
    .split('.')
    .filter(t => t !== '')
    .reduce((prev, cur) => prev && prev[cur], obj)
  )
}

/*
 * @params {object, string} the attribute to extract the id from
 *
 * use this when you are not sure, whether an _id or an object with an attribut
 * _id is provides.  e.g req.body.group might be
 *
 * @example
 * extractId('1234') // => '1234'
 * extractId({ _id: '1234', name: 'some name' }) // => '1234'
 * extractId({ id: '1234', name: 'some name' }) // => '1234'
 * extractId({ ID: '1234', name: 'some name' }) // => '1234'
 */
export function extractId (requestBodyAttr) {
  if (!requestBodyAttr || requestBodyAttr === null || requestBodyAttr === undefined)
    return null

  if (typeof requestBodyAttr === 'string')
    return requestBodyAttr;

  if (typeof requestBodyAttr === 'object' && requestBodyAttr._id !== undefined)
    return requestBodyAttr._id

  if (typeof requestBodyAttr === 'object' && requestBodyAttr.id !== undefined)
    return requestBodyAttr.id

  if (typeof requestBodyAttr === 'object' && requestBodyAttr.Id !== undefined)
    return requestBodyAttr.Id

  if (typeof requestBodyAttr === 'object' && requestBodyAttr.ID !== undefined)
    return requestBodyAttr.ID

  return false;
}

/*
 * is object check
 * @param {Object} value, value to check
 */
export function isObject (value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value))
}

export function removeKeyFromObject(obj, attr = '_id') {
  if (typeof obj !== 'object' || Array.isArray(obj)) return obj
  const o = JSON.parse(JSON.stringify(obj))
  return deleteKey(o, { key: attr })
}
