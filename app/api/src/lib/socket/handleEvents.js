export function registerSocketEvents (app) {
  const { wss } = app

  wss.on('connection', (socket) => {

    socket.on('join', (room) => {
      app.log.info(`[Socket] room 7 entered by ${socket.id}`)
      socket.join('7')
      wss.sockets.in('7').emit('hello', {msg: `Hello ${socket.id}`})
      wss.in('7').fetchSockets()
        .then((sockets) => { 
          app.log.info({ msg: 'members', socket: sockets.map(s => s.id) })
        })
        .catch((err) => { console.log(err) })
    })

    socket.on('leave', (room) => {
      socket.leave('7')
      wss.sockets.in('7').emit('hello', {msg: `left room ${socket.id}`})
      wss.in('7').fetchSockets()
        .then((sockets) => { 
          app.log.info({ msg: 'members', socket: sockets.map(s => s.id) })
        })
        .catch((err) => { console.log(err) })
    })

    socket.on('details', (args) => {
      app.log.info('[Socket] details received') 
      wss.emit('hello', { msg: 'we got your message' })
    })

    app.log.warn(`[socket] connected ${socket.id}`)
    wss.emit('hello', { msg: 'some message to you' })

    socket.on('disconnect', () => {
      app.log.warn(`[socket] disconnected ${socket.id}`)
    })
  })

  wss.on('connection_error', (err) => {
    console.log(err.req)
    console.log(err.code)
    console.log(err.message)
    console.log(err.context)
  })

  app.eventbus.on('dataUpdate', (payload) => {
    // validate schema
    wss.emit('data', payload)
  })

  app.eventbus.on('dataNew', (payload) => {
    // validate schema
    wss.emit('data', payload)
  })
} 
