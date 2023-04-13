
/*
 * project init
 */
function projectInit(state, action) {
  const uiState = {
    currentTool: false
  }
  return { ...state, ...uiState }
}

/*
 * set current page 
 */
function currentPageSet(state) {
  return {
    ...state, navigationOpen: false
  }
}

/*
 *  toggle ui
 */
function uiToggle(state, action) {
  const uiState = {}
  if (!action.payload.list) return state

  action.payload.list.forEach(field => {
    if (state.hasOwnProperty(field)) {
      if (state[field]) {
        uiState[field] = false
      }
      if (!state[field]) {
        uiState[field] = true
      }
      if (state[field] === true || state[field] === false) {
        uiState[field] = !state[field]
      }

    }
  })
  return { ...state, ...uiState }
}

/*
 *  update ui
 */
function uiUpdate(state, action) {
  if (state.mobile && (action.payload.navigationOpen || action.payload.currentTool)) {
    if (action.payload.navigationOpen === true && state.currentTool !== false) {
      action.payload.currentTool = false
    }
    if (action.payload.currentTool !== true && state.navigationOpen !== false) {
      action.payload.navigationOpen = false
    }
  }

  return { ...state, ...action.payload }
}

export {
  projectInit,
  currentPageSet,
  uiToggle,
  uiUpdate,

}
