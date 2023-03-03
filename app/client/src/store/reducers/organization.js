import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.organization
      case 'organization/update':
        return action.payload
      default:
        return state
    }
  }
}
