/*
 * Socket events
 */
import Project from '#src/app/core/model/project/project.model.js'
import { streamProjectData } from './streamProjectData.js'
import { payloadFabric } from '../dataObjectHelpers.js'

export async function registerSocketEvents (app) {
  // get web socket server instance
  const { wss } = app

/*
 * handle socket connections and register socket events
 */
  wss.on('connection', async (socket) => {

    /* log connection and say hello */
    app.log.warn(`[socket] connected ${socket.id}`)
    wss.emit('hello', { id: socket.id })

    /* always send a list with the projects accessible to this user */
    const projects = await Project.find()
    socket.emit('projects/list', { projects } )

    /* on discconnect */
    socket.on('disconnect', () => {
      app.log.warn(`[Socket] disconnected ${socket.id}`)
    })

    /* on join room (currently only project) */
    socket.on('join', async (room) => {
      try {
        // get project 
        const project = await Project.findOne({ _id: room })
        // early return if the project does not exist
        if (!project) {
          return socket.emit('error', { 
            error: { msg: `There is no project with _id ${room}` } }
          )
        }

        socket.join(room)
        socket.emit('joinConfirmation', { room, project })
        app.log.info(`[Socket] socket ${socket.id} joined room ${room}`)
        // stream all project data to socket client
        return streamProjectData(socket, room)
      } catch (err) {
        socket.emit('error', { error: { msg: 'Error joining and loding project room' } })
        app.log.error(err)
      }
    })

    /* on leave */
    socket.on('leave', (room) => {
      socket.leave(room)
      socket.emit('leaveConfirmation', room)
      wss.in(room).emit('memberLeft', { room, msg: `member left ${socket.id}` })
    })
  })

  /* on connection error */
  wss.on('connection_error', (err) => {
    app.log.error({ msg: '[Socket]', error: err })
  })

  /* on dataUpdate */
  app.eventbus.on('dataUpdate', (obj) => {
    // account, ticket, tag, user, project
    const payload = payloadFabric[obj.type](obj.obj)
    // if user inform all rooms
    if (payload._type === 'user') 
      return  wss.emit('data', payload)
    // else, ticket or tag, inform only project
    wss.in(payload._project).emit('data', payload)
  })

  app.eventbus.on('dataNew', (payload) => {
    // validate schema
    wss.to(payload._project).emit('data', payload)
  })
} 
