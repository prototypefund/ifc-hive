import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.project
      case 'project/addlist':
        return {
          ...state, ...{ list: action.payload }
        }
      case 'project/setId':
        return {
          ...state, ...{ id: action.payload }
        }
      default:
        return state
    }
  }
}
