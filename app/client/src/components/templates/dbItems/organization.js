export default function (props = {}) {
  return {
    _id: props._id || '',
    _type: "org",
    _path: props._path || '',
    _title: props._title || '', // Nickname (email)  Organization
    _source: {
      name: props.name || '',
      shortname: props.shortname || '',
      active: props.active || false,
      description: props.description || '',
      url: props.url || '',
    },
  }
}
