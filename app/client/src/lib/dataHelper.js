/*
 * Data helpers 
 *
 * Note that primary data items are only referenced in the store. The actual
 * data items are currently kept in a map in window.$pacificoData. This is to
 * navigate around performance issues of vue when dealing with large amounts of
 * data.
 */
import { filter } from 'ramda'
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
  return window.$pacificoData[docUUID] ? JSON.parse(JSON.stringify(window.$pacificoData[docUUID])) : undefined
}

/* get source attribute of data item */
const getSource = (docUUID) => {
  return getFullItem(docUUID)?._source || undefined
}
/* get full item */
const setActionItem = (docUUID, content) => {
  return window.$pacificoData[docUUID] = content || undefined
}
/* search handler */
const searchHandler = (actionId, query, params = { offset: 0, limit: 100 }, lookUp) => {
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
    let limitedData = Object.keys(data)
    if (params) {
      if (!params.endless) {
        if (limitedData.length >= params.offset + params.limit) {
          // more results than requested available
          limitedData = limitedData.splice(params?.offset, params?.limit)
          // add pseudo paging element
          const pseudoId = `action/${actionId}_child`
          limitedData.push(pseudoId)
          setActionItem(pseudoId, {
            _id: pseudoId,
            _type: '_paging',
            _title: 'page for more',
            _actionId: `${actionId}_child`,
            _params: {},
            _query: query
          })
        }
      }
    }
    return limitedData
  }
}

export {
  isTrueFalse,
  isTrue,
  isFalse,
  getFullItem,
  getSource,
  searchHandler,
}
