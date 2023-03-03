import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.route
      case 'route/update':
        return JSON.parse(JSON.stringify(action.payload))
      default:
        return state
    }
  }
}
