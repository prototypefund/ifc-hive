import { mergeDeepRight, clone} from 'ramda'
import { applicationState, storePatterns } from '../state'

export default ($eventbus) => (state, action) => {

  if (state) {
    let newPage, pageUUID

    switch (action.type) {

        /* init */
      case 'init':
        return applicationState.pages
        // initially add a new preconfigured page store. Will be handled in
        // routes files in beforeEnter hook

        /* pages/add */
      case 'pages/add':
        pageUUID = action.payload.uuid || action.routeName.replace('.', '-')
        if (state[pageUUID]) {
          // if the page already exists do nothing
          return state
        }
        // create a new page object based on the default page config
        const page = clone(mergeDeepRight(storePatterns.page, action.payload))
        page.uuid = pageUUID
        page.routeName = action.routeName

        newPage = {}
        newPage[page.uuid] = page
        return mergeDeepRight(state, newPage)

        /*
         * pages/update
         * update a configured page State usually called when current page changes
         */
      case 'pages/update':
        if (state[action.stateName]) {
          newPage = {}
          // if we had the last current page already, just merge their states
          // based on the latest version coming from currentPage
          newPage[action.stateName] = mergeDeepRight(state[action.stateName], action.payload)
        } else {
          console.error("pages/update no state for query")
        }
        return mergeDeepRight(state, newPage)

        /* default */
      default:
        return state
    }
  }
}
