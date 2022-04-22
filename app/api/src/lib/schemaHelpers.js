/*
 * is object check
 * @param {Object} value, value to check
 */
export function isObject (value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value))
}

/*
 * Recursively remove _id properties from object
 * @param {Object} obj, the object or schema to remote the _id property from
 *
 * @TODO complete recursive removal of properties
 */
export function removeIdProperty (doc = {}) {
  // copy the provided object
  const obj = { ...doc }
  // do we have an object at all?
  if (!isObject(obj)) { return false }

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
    // if the property is an object, recursively call this function
    // if (isObject(objectValue)) {
    //   const child = removeIdProperty(objectValue)
    //   if (child !== null) {
    //     return child
    //   }
    // }
  }
}
