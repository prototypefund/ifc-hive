/*
 * Socket Send message
 *
 * Listens to the event bus and emits accordingly messages to the socket server.
 */
export function registerSocketApi($socket, $store, $eventbus) {

  $eventbus.on('socketJoinRoom', (roomId) => {
    $socket.emit('join', roomId)
  })

  $eventbus.on('socketLeaveRoom', (roomId) => {
    $socket.emit('leave', roomId)
  })

  $eventbus.on('socketGetProjectData', (projectId) => {
    $socket.emit('requestProjectData', { project: projectId })
  })
}