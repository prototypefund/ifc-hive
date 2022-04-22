import Note from './note.model.js'

/*
 * create note
 */
export async function createNote (req, res) {
  try {
    const newNote = await Note.create(req.body)
    res.code(201).send(newNote)
  } catch (err) {
    res.code(500).send(err)
  }
}

/*
 * get notes collection
 */
export async function getNotes (req, res) {
  try {
    const notes = await Note.find({})
    res.code(200).send(notes)
  } catch (err) {
    res.code(500).send(err)
  }
}

/*
 * get single note
 */
export async function getNote (req, res) {
  try {
    const note = await Note.findById(req.params.id)
    res.code(200).send(note)
  } catch (err) {
    res.code(500).send(err)
  }
}

/*
 * update note by id
 */
export async function updateNote (req, res) {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.code(200).send(note)
  } catch (err) {
    res.code(500).send(err)
  }
}

/*
 * delete note
 */
export async function deleteNote (req, res) {
  try {
    const note = await Note.findByIdAndRemove(req.params.id)
    res.code(200).send(note)
  } catch (err) {
    res.code(500).send(err)
  }
}
