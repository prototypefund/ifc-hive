/*
 * user ES mapping
 */
export default {
  properties: {
    id: { type: 'keyword' },
    nickname: { type: 'text', fields: { raw: { type: 'keyword' } } },
    firstname: { type: 'text', fields: { raw: { type: 'keyword' } } },
    lastname: { type: 'text', fields: { raw: { type: 'keyword' } } },
    email: { type: 'text', fields: { raw: { type: 'keyword' } } },
  }
}
