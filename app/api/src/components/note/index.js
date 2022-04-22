import * as opts from './note.route.options.js'

export default function noteRoutes (app, options, done) {
  /* add new note */
  app.post('/notes', opts.addNoteOptions)
  /* get notes collection */
  app.get('/notes', opts.getNotesOptions)
  /* get single note by id */
  app.get('/note/:id', opts.getNoteOptions)
  /* update note by id */
  app.put('/note/:id', opts.updateNoteOptions)
  /* delete note by id */
  app.delete('/note/:id', opts.deleteNoteOptions)

  /* don't forget to call done */
  done()
}
