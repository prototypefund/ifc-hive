import Project from '#src/app/core/model/project/project.model.js'
import Ticket from '#src/app/journal/model/ticket/ticket.model.js'
import Tag from '#src/app/core/model/tag/tag.model.js '
import User from '#src/app/core/model/user/user.model.js'

async function streamProjectData (socket, projectId) {
  /* inform the client */
  const ticketCount = await Ticket.find({ isDeleted: false, project: projectId  }).count()
  const userCount = await User.find({ isDeleted: false  }).count()
  const tagCount = await Tag.find({ project: projectId }).count()
  const expect = ticketCount + userCount + tagCount
  let loadingCount = 0

  // inform client about batch start
  socket.emit('batchDataStart', { expect, ticketCount, userCount, tagCount })

  const checkLoadingCount = (doc) => {
    loadingCount += 1
    if (loadingCount == expect ) {
      socket.emit('batchDataStop')
    }
  }

  /* send ticket stream */
  Ticket
    .find({ project: projectId })
    .cursor()
    .on('data', (doc) => {
      const { _id, title, disId, project } = doc
      const payload = {
        _id,
        _title: title,
        _disId: disId,
        _project: project,
        _source: doc,
        _type: 'ticket'
      }
      /* emit data packages to client */
      socket.emit('data', payload )
      checkLoadingCount(doc)
    })

  User
    .find({ isDeleted: false })
    .select('title firstname lastname nickname email _id')
    .populate('organization account')
    .cursor()
    .on('data', (doc) => {
      const payload = {
        _id: doc._id,
        _title: `${doc.firstname} ${doc.lastname}`,
        _disId: doc.nickname,
        _project: null,
        _source: doc,
        _type: 'user'
      }
      /* emit data packages to client */
      socket.emit('data', payload )
      checkLoadingCount(doc)
    })

  Tag
    .find({ project: projectId })
    .cursor()
    .on('data', (doc) => {
      const payload = {
        _id: doc._id,
        _title: doc.title,
        _disId: doc.title,
        _project: doc.project,
        _source: doc,
        _type: 'tag'
      }
      /* emit data packages to client */
      socket.emit('data', payload )
      checkLoadingCount(doc)
    })
}

export {
  streamProjectData,
}
