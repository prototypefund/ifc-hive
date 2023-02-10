export default function (props = {}) {
  return {
    _id: props._id || '', // UUID
    _type: "project", // Meta type
    _path: props._id || '',
    _title: props._id || '',
    _source: {
      title: props.title || '',
      owner: props.owner || '', // uuid user
      description: props.description || '',
      keywords: props.keywords || '',
      parent: props.parent || '', // type project
    },
  }
}
