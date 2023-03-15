import { applicationState } from '../state'

// reducers must always return the complete
// subtreet from path. 
// clone, objectSpread
// möglichst sparsam ersetzen, um unnötige Events zu vermeiden. 

export default ($eventbus) => (state, action) => {
  if (state) {
    let socketState
    switch (action.type) {
      case 'init':
        return applicationState.socket
      case 'socket/status':
        socketState = JSON.parse(JSON.stringify(state))
        socketState.status = action.payload.status
        return socketState
      default:
        return state
    }
  }
}
