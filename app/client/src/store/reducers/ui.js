import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    let uiState
    switch (action.type) {

      /* init */
      case 'init':
        return applicationState.ui
      case 'projectInit':
        uiState = {
          currentTool: false
        }
        return { ...state, ...uiState }
      /* currentPage/set */
      case 'currentPage/set':
        return {
          ...state, navigationOpen: false
        }

      /* ui/update */
      case 'ui/update':
        if (state.mobile && (action.payload.navigationOpen || action.payload.currentTool)) {
          if (action.payload.navigationOpen === true && state.currentTool !== false) {
            action.payload.currentTool = false
          }
          if (action.payload.currentTool !== true && state.navigationOpen !== false) {
            action.payload.navigationOpen = false
          }
        }

        return {
          ...state, ...action.payload
        }

      /* default return unchanged state */
      default:
        return state
    }
  }
}
