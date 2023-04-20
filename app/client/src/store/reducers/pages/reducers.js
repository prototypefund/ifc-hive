/*
 * pages reducers
 */
import { mergeDeepRight, clone } from 'ramda'
import { storePatterns } from '../../state'
// import { globalPages } from '@_/setup/application.js'

/* add page */
function pagesAdd(state, action) {
  const pageUUID = action.payload.uuid || action.routeName.replaceAll('.', '-')
  // if the page already exists do nothing
  if (state[pageUUID]) return state
  // create a new page object based on the default page config
  const page = clone(mergeDeepRight(storePatterns.page, action.payload))
  page.uuid = pageUUID
  const newPage = {}
  newPage[page.uuid] = page

  return mergeDeepRight(state, newPage)
}

/* update page */
function pagesUpdate(state, action) {
  const newPage = {}
  if (state[action.stateName]) {
    // if we had the last current page already, just merge their states
    // based on the latest version coming from currentPage
    newPage[action.stateName] = mergeDeepRight(state[action.stateName], action.payload)
  } else {
    console.error("pages/update no state for query")
  }

  return mergeDeepRight(state, newPage)
}

export {
  pagesAdd,
  pagesUpdate,
}
