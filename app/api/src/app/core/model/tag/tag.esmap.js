/*
 * tag ES mapping
 */
export default {
  properties: {
    id: { type: 'keyword' },
    project: { type: 'keyword' },
    title: { type: 'text', fields: { raw: { type: 'keyword' } } },
    type: { type: 'text', fields: { raw: { type: 'keyword' } } },
    isDeleted: { type: 'boolean' },
    autocomplete: { type:  'search_as_you_type', fields: { completion: { type: 'completion' } } }
  }
}
