/*
 * Build meta reducers for store configuration
 */
import { metaReducerPagesAdd } from './currentPage/metaReducerPagesAdd.js'

/*
 * decorate action object
 * with eventbus and some lookup object from the root state
 * @TODO try to keep slim or even reduce
 */
const decorateAction  = ($eventbus) => (reducer) => {

  return (state, action) => {
    action.meta = {
      $eventbus: $eventbus, // used to communicate with other components
      pagesLookup: state.pages,
      widgetsLookup: state.widgets,
      dataLookup: state.data,
      uiLookup: state.ui,
    }

    return reducer(state, action)
  }
}

/*
 *  build meta reducer array
 */
const metaReducers =  ($eventbus) => [
  decorateAction($eventbus),
  metaReducerPagesAdd($eventbus)
]

export default metaReducers
