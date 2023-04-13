/*
 * ticket ES mapping
 */
export default {
  properties: {
    id: { type: 'keyword' },
    title: { type: 'text', fields: { raw: { type: 'keyword' } } },
    start: { type: 'date' },
    due: { type: 'date' },
    expires: { type: 'date' },
    closed: { type: 'boolean' }
  }
}
