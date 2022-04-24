import * as controller from './note.controller.js'
import { removeIdProperty } from '#src/lib/schemaHelpers.js'

/*
 * note schema
 */
export const noteSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  }
}

const noteSchemaWithoutId = { ...noteSchema }
noteSchemaWithoutId.properties = removeIdProperty(noteSchema.properties)

/*
 * options add note
 */
export const addNoteOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['note'],
    summary: 'v1.0.0 create a new note',
    description: 'Add a new note',
    body: noteSchemaWithoutId,
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: {
      201: noteSchema,
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.createNote
}
/*
 * options get notes
 */
export const getNotesOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['note'],
    summary: 'v1.0.0 return notes collection',
    description: 'Query note collection and return a list of notes',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: {
      200: {
        type: 'array',
        items: noteSchema,
      }
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.getNotes,
}

/*
 * get single note
 */
export const getNoteOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['note'],
    summary: 'v1.0.0 returns a single not by id',
    description: 'Query note collection by id and return single note.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: {
      id: { type: 'string' }
    },
    response: {
      200: noteSchema,
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.getNote
}

/*
 * update single note by id
 */
export const updateNoteOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['note'],
    summary: 'v1.0.0 updates a single note by id and return new version',
    description: 'Update a single note by id and return new version',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    body: noteSchema,
    params: {
      id: { type: 'string' }
    },
    response: {
      200: noteSchema,
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.updateNote
}

/*
 * delete single note by id
 */
export const deleteNoteOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['note'],
    summary: 'v1.0.0 deletes a single not by id',
    description: 'Delete a single note by id',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: {
      id: { type: 'string' }
    },
    response: {
      200: noteSchema,
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.deleteNote
}
