import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.user
      case 'user/update':
        return action.payload
      default:
        return state
    }
  }
}
