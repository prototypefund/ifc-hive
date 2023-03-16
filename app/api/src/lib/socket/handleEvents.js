/*
 * Socket events
 */
import Project from '#src/app/core/model/project/project.model.js'
import Ticket from '#src/app/journal/model/ticket/ticket.model.js'
import { createDataPayload } from '#src/lib/dataObjectHelpers.js'

export async function registerSocketEvents (app) {
  const { wss } = app

  wss.on('connection', async (socket) => {


    /* log connection and say hello */
    app.log.warn(`[socket] connected ${socket.id}`)
    wss.emit('hello', { id: socket.id })


    const projects = await Project.find()
    wss.emit('projects/list', { projects } )

    const tickets = await Ticket.find().limit(10)
    const data = tickets.map(t => {
      const d = {}
      d._source = t
      d._id = t._id
      d._title = t.title
      d._path = null,
      d._project = t.project
      d._type = 'memo'
      d._disId = t.disId
      return d
    })
    wss.emit('dataTest', data)

    /* on discconnect */
    socket.on('disconnect', () => {
      app.log.warn(`[Socket] disconnected ${socket.id}`)
    })

    /* on join */
    socket.on('join', (room) => {
      socket.join(room.id)
      socket.emit('joinConfirmation', room)
      wss.sockets
        .in(room.id)
        .emit('memberJoined', { 
          room: room.id,
          msg: `member joined ${socket.id}`
        })
      app.log.info(`[Socket] socket ${socket.id} joined room ${room.id}`)
    })

    /* on leave */
    socket.on('leave', (room) => {
      socket.leave(room.id)
      socket.emit('leaveConfirmation', room)
      wss.sockets
        .in(room.id)
        .emit('memberLeft', {
          room: room.id,
          msg: `member left ${socket.id}`
        })
    })

    /* on details  */
    socket.on('details', (args) => {
      app.log.info('[Socket] details received') 
      wss.emit('hello', { msg: 'we got your message' })
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
