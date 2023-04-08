import { filter, forEachObjIndexed } from 'ramda'
/*
 * splitIdentifier
 * @param { array } identifier, an array with identifiers i.e prop:value -> tags:my-tag-uuid
 *
 * @return { object } an object containing the properties as keys and arrays for their values
 */
const splitIdentifier = (identifier) => {
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

/* is true or false */
const isTrueFalse = (value) => {
  return ((value === 'true' || value === true) || (value === 'false' || value === false));
}

/* is true? */
const isTrue = (value) => {
  return value === true || value === 'true'
}

/* is false */
const isFalse = (value) => {
  return value === false || value === 'false'
}

/* get full item */
const getFullItem = (docUUID) => {
  return window.$pacificoData[docUUID] || undefined
}

/* get source attribute of data item */
const getSource = (docUUID) => {
  return getFullItem(docUUID)?._source || undefined
}

/* search handler */
const searchHandler = (actionId, query, params = { offset: 0, limit: 100 }, lookUp) => {
  if (!params.offset) params.offset = 0
  if (!params.limit) params.limit = 100
  let identifier = false
  let matchingData = {}
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
      console.log("schniedel " + actionId, limitedData)
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
}

export {
  splitIdentifier,
  isTrueFalse,
  isTrue,
  isFalse,
  getFullItem,
  getSource,
  searchHandler,
}
