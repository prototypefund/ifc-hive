import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.uploader
      case 'uploader/add':
        return mergeDeepRight(state, action.payload)
      case 'uploader/remove':
        return JSON.parse(JSON.stringify(action.payload))
      default:
        return state
    }
  }
}
