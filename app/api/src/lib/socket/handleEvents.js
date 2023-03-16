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


    /* always send a list with the projects accessible to this user */
    const projects = await Project.find()
    wss.emit('projects/list', { projects } )

      Ticket
        .find({}, { _id: 1, title: 1, owner: 1, project: 1, tags: 1, disId: 1 })
        // .limit(100)
        // .cursor()
        .on('data', (doc) => {
          app.log.info({ msg: 'Send socket Package', doc })
          const { _id, title, disId, project } = doc
          doc.tags.push('tag-todo')
          const payload = {
            _id,
            _title: title,
            _disId: disId,
            _project: project,
            _source: doc,
            _type: 'memo'
          }
          socket.emit('data', [payload] )
        })

    /* send dummy data when project data are request by the client */
    socket.on('requestProjectData', async (projectId) => {
      Ticket
        .find({}, { _id: 1, title: 1 })
        .limit(100)
        .cursor()
        .on('data', (doc) => {
          app.log.info({ msg: 'Send socket Package', doc })
        })
    })


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

    socket.on('getProjectData', async (request) => {
      socket.emit('projectDataConfirmation', {
        msg: '... Kommt gleich',
        count: {
          total: 340,
          tickets: 300,
          user: 4,
          tags: 36,
        }
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
