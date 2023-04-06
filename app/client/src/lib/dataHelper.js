import { filter, forEachObjIndexed } from 'ramda'
/*
 * splitIdentifier
 * @param { array } identifier, an array with identifiers i.e prop:value -> tags:my-tag-uuid
 *
 * @return { object } an object containing the properties as keys and arrays for their values
 */
export const splitIdentifier = (identifier) => {
  let identifierKeyVal = false
  let attributes = {}
  identifier.forEach(identifier => {
    identifierKeyVal = identifier.split(':')
    if (!attributes[identifierKeyVal[0]]) {
      attributes[identifierKeyVal[0]] = []
    }
    attributes[identifierKeyVal[0]].push(identifierKeyVal[1])
  })

  return attributes
}
export const isTrueFalse = (value) => {
  return ((value === 'true' || value === true) || (value === 'false' || value === false));
}
export const isTrue = (value) => {
  return value === true || value === 'true'
}
export const isFalse = (value) => {
  return value === false || value === 'false'
}
export const getFullItem = (docUUID) => {
  return window.$pacificoData[docUUID] || undefined
}
export const getSource = (docUUID) => {
  return getFullItem(docUUID)?._source || undefined
}

export const searchHandler = (actionId, query, params = { offset: 0, limit: 100 }, lookUp) => {
  if (!params.offset) params.offset = 0
  if (!params.limit) params.limit = 100
  let data = JSON.parse(JSON.stringify(lookUp))
  if (query.indexOf('/search') > -1) {
    //es
    return data
  }
  if (query.indexOf('meta/') > -1) {
    if (query === "meta/tickets") {
      data = filter((item) => {
        return item._type === 'ticket'
      }, data)
    }
    if (query === "meta/tags") {
      data = filter((item) => {
        return item._type === 'tag'
      }, data)
    }
    if (query === "meta/users") {
      data = filter((item) => {
        return item._type === 'user'
      }, data)
    }
    if (query === "meta/projects") {
      data = filter((item) => {
        return item._type === 'project'
      }, data)
    }
    if (query === "meta/organizations") {
      data = filter((item) => {
        return item._type === 'organization'
      }, data)
    }
    if (params) {
      let limitedData = Object.keys(data)
      if (limitedData.length >= params?.offset + params?.limit) {
        // more results than requested available
        limitedData = limitedData.splice(params?.offset, params?.limit)
        // add pseudo paging element
        limitedData.push({
          _type: 'pseudo',
          _title: 'page for more',
          _actionId: `${actionId}_child`,
          _params: {},
          _query: query
        })
        return limitedData
      }
      if (limitedData.length <= params?.offset + params?.limit) {
        return limitedData
      }

    }

  }
  if (params == "ElasticSearchübernimmt hier") {
    //TODO THIS NEEDS TO BE REPLACED BY AN ES CALL
    if (params.identifier) {
      identifier = splitIdentifier(params.identifier)
      // iterate each dataItem to find  out if it fits our selectors
      forEachObjIndexed((dataItem, uuid) => {
        const item = dataItem._source
        // iterate each selector property and check if value satisfies the selector
        forEachObjIndexed((values, prop) => {
          if (!matchingData[uuid]) {
            if (item.hasOwnProperty(prop)) {
              // get the property of our dataItem to check it's type to properly compare with the identifiers request
              const itemProp = item[prop]
              values.forEach(val => {
                if (!matchingData[uuid]) {
                  if (isTrueFalse(val)) {
                    if (isTrue(val) && itemProp === true || itemProp === 'true') {
                      matchingData[uuid] = dataItem
                    }
                    if (isFalse(val) && itemProp === false || itemProp === 'false') {
                      matchingData[uuid] = dataItem
                    }
                  } else {
                    if (typeof (itemProp) === 'object' && itemProp.indexOf(val) > -1) {
                      matchingData[uuid] = dataItem
                    }
                    if (typeof (itemProp) === 'string' && itemProp == val) {
                      matchingData[uuid] = dataItem
                    }
                  }
                }
              })
            }
          }
        }, identifier)
      }, data)
      if (params.excluded && params.excluded.length > 0) {
        identifier = splitIdentifier(params.excluded)
        matchingData = filter((item) => {
          // find and remove the excluded elements from our search result
          let bail = false
          forEachObjIndexed(((val, key) => {
            // if we don't have the exclude field afterall, we can't fail can't we?
            if (!item._source.hasOwnProperty(key)) {
              return true
            }
            if (isTrueFalse(val)) {
              if (isTrue(val)) {
                bail = item._source[key] === true || item._source[key] === 'true'
              }
              if (isFalse(val)) {
                bail = item._source[key] === false || item._source[key] === 'false'
              }
            } else {
              if (key !== 'tags') {
                console.error('so far there is just a filter based on arrays, strings and true false values allowed')
              }
              if (typeof (item._source[key]) === 'object') {
                val.forEach(exclude => {
                  // if we find one of the excluded array items in our current data item, we'll bail on it
                  if (item._source[key].indexOf(exclude) > -1) {
                    return bail = true
                  }
                })
              }
              if (typeof (item._source[key]) === 'string') {
                // if the property contains or is the no no value we exclude it 
                if (item._source[key].indexOf(val) > -1 || item._source[key] == val) {
                  return bail = true
                }
              }
            }
          }), identifier);
          return !bail;
        }, matchingData)

      }


    } else {
      matchingData = data
    }
  }

  return Object.keys(data)
}



