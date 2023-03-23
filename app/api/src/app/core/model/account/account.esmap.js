
export default {
  _id: { type: 'keyword' },
  name: { type: 'text' },
  shortname: { type: 'text' },
  code: { type: 'code' },
  active: { tye: 'boolean' },
  blocked: { type: 'boolean' },
  owner: {
    properties: {
      _id: { type: 'keyword' },
      title: { type: 'text' },
      firstname: { type: 'text' },
      lastname: { type: 'lastname' },
    }
  },
  tags: { type: 'text', fields: { raw: { type: 'keyword' } } }
}
