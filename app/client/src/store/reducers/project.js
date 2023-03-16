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
      case 'project/addlookup':
        return {
          ...state, ...{ lookup: action.payload }
        }
      case 'project/setId':
        if (state.id && action.payload) {
          $eventbus.emit('socketLeaveRoom', state.id)
        }
        if (action.payload) {
          $eventbus.emit('socketJoinRoom', action.payload)
        }
        return {
          ...state, ...{ id: action.payload }
        }
      default:
        return state
    }
  }
}
