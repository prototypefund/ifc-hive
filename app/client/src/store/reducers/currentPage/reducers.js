/*
 * current page reducers
 */
import { mergeDeepRight } from 'ramda'
import { loadingHold } from '../../state.js'

/*
 * set current page
 */
function currentPageSet (state, action) {
  const { pagesLookup, uiLookup, $eventbus } = action.meta

  if (!action.routeName) return state
  // create our json friendly uuid
  let currPage = {}
  let scrollY = false
  // get current scroll position to apply it to the ticketry of page

  const uuid = action.routeName.replaceAll('.', '-')
  // check if that requested page has already been preconfigured (should always be the case)
  if (pagesLookup && pagesLookup[uuid] && pagesLookup[uuid].uuid) {
    // create a new currentPage object based on the url params merged ontop of
    // the default page config
    currPage = JSON.parse(JSON.stringify(mergeDeepRight(pagesLookup[uuid], action.payload)))
    if (uiLookup.mobile) {
      // TODO find a way to decouple this
      if (currPage.slots) {
        currPage.grid.columns_bak = currPage.grid.columns
        currPage.grid.columns = 1
        currPage.slots.forEach(slot => {
          slot.column_bak = slot.column
          slot.column = 12
        })
      }
    }
  } else {
    console.error("race condition? a currentpage without a uuid? dafuq? bruder? alter?")
    console.dir(pagesLookup)
    console.dir(action)
    currPage = action.payload
  }

  if (!currPage.scrollTop) {
    // TODO find a way to decouple this
    scrollY = document.getElementById("appComponent")
      ? document.getElementById("appComponent").scrollTop
      : 0
  }
  if (state.routeName) {
    // update our ticketrized preconfigured page with the new version which
    // includes url params and user data
    $eventbus.emit('store/dispatch', {
      type: 'pages/update',
      stateName: state.uuid,
      payload: {
        ...state,
        scrollY
      }
    })
  }
  // apply last scroll position to currentPage
  // TODO find a way to decouple this
  setTimeout(() => {
    if (currPage.scrollY) {
      for (let i = 0; i < currPage.scrollY; i++) {
        setTimeout(() => {
          document.getElementById("appComponent").scrollTo(0, i)
        }, 50)
      }
    }
  }, loadingHold * 2)

  return currPage
}

export {
  currentPageSet,
}
