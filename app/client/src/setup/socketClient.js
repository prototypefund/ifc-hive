/*
 * Send messages to the socket server
 * Listens to the event bus and emits accordingly messages to the socket server.
 */
function registerSocketClient($socket, $store, $eventbus) {

  $eventbus.on('socketJoinRoom', (roomId) => {
    $socket.emit('join', roomId)
  })

  $eventbus.on('socketLeaveRoom', (roomId) => {
    $socket.emit('leave', roomId)
  })

  $eventbus.on('socketGetProjectData', (projectId) => {
    $socket.emit('getProjectData', projectId)
  })
}

export default registerSocketClient
export {
  registerSocketClient
}
