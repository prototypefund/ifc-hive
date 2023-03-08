/*
 * is object check
 * @param {Object} value, value to check
 */
export function isObject (value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value))
}

/*
 * Recursively remove _id properties from object
 * @param {Object} obj, the object or schema to remove the _id property from
 *
 * @TODO complete recursive removal of properties
 */
export function removeIdProperty (doc = {}) {
  // copy the provided object
  if (!isObject(doc)) { return false }
  const obj = { ...doc }
  // // do we have an object at all?

  // get properties of object
  const entries = Object.entries(obj)

  // iterater over properties. Find _id properties and nested objects
  for (let i = 0; i < entries.length; i += 1) {
    // get key and value of entry i
    const [objectKey, objectValue] = entries[i]

    // if key id _id delete property
    if (objectKey === '_id') {
      delete obj._id
      return obj
    }
  }
  return false
}
