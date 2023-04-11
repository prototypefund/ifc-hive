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
function randomIdGenerator (length = 16) {
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
function updateDeepObjectByPath (obj, path, value) {
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
 function getNestedPropertiesByPath (obj, ...selectors) {
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
function extractId (requestBodyAttr) {
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
function isObject (value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value))
}

/*
 * remove key from object
 */
function removeKeyFromObject(obj, attr = '_id') {
  if (typeof obj !== 'object' || Array.isArray(obj)) return obj
  const o = JSON.parse(JSON.stringify(obj))
  return deleteKey(o, { key: attr })
}

/*
 * replace human-friendly placeholder IDs with actual UUID's
 * @param {array} objects - array of objectsw with human-friendly placeholder ID's
 * @param {object} id = the idMap with key value pairs for humand-friendly ID to UUIDv4
 */
function mapIds (objects, idLookup, fields = ['_id']) {
  // early return if there is nothing to do
  if (!objects || !Array.isArray(objects) || objects.length < 1) {
    return
  }
  // iterate over objects and replace the origina obj._id with the UUID from idLookup
  return objects.map((e) => { 
    fields.forEach((f) => { 
      // map id if the field is a string value
      if (e[f] && typeof e[f] === 'string') {
        e[f] = idLookup[e[f]]
      }
      // map id if the field is an array
      if (e[f] && Array.isArray(e[f])) {
        e[f].forEach((v, i) => { e[f][i] = idLookup[e[f][i]] })
      }
    })
    return e
  })
}

/*
 * get object size in bits
 */
function getObjectSizeInBytes (obj) {
  let str = null
  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj)
  }
  // Get the length of the Uint8Array
  const bytes = new TextEncoder().encode(str).length
  return bytes
}


export { 
  randomIdGenerator,
  updateDeepObjectByPath,
  getNestedPropertiesByPath,
  extractId,
  isObject,
  removeKeyFromObject,
  mapIds,
  getObjectSizeInBytes,
}
