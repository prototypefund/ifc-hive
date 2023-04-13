/*
 * project ES mapping
 */
export default {
  properties: {
    id: { type: 'keyword' },
    title: { type: 'text', fields: { raw: { type: 'keyword' } } },
    shorttitle: { type: 'text', fields: { raw: { type: 'keyword' } } },
    code: { type: 'text', fields: { raw: { type: 'keyword' } } },
    journal: { type: 'keyword' },
    isDeleted: { type: 'boolean' },
  }
}
