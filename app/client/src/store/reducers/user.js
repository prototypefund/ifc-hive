import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    let userState
    switch (action.type) {
      case 'init':
        return applicationState.user
      case 'user/set':
        if (state._id) return state
        return action.payload
      case 'user/update':
        userState = JSON.parse(JSON.stringify(state))
        return { ...userState, ...action.payload }
      default:
        return state
    }
  }
}
