export default function (props) {
  return {
    _id: '', // UUID
    _type: "project", // Meta type
    _path: '',
    _title: '',
    _source: {
      id: '',
      title: '',
      owner: '', // uuid user
      description: '',
      keywords: '',
      parent: '', // type project
      path: '', // materialized path #id1#id2#id3 etc.
    },
  }
}
