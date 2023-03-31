export default function (props = {}) {
  return {
    _id: props._id || "", // UUID
    _path: props._path || "",
    _project: props._project || "",
    _type: "memo",
    _title: props._title || "",
    _created: props._created || "",
    _modified: props._modified || "",
    _source: {
      _id: props._id || "",
      title: props.title || "",
      path: props.path || "", // materialized path
      project: props.project || "",
      body: props.body || {}, // block
      closed: props.closed || false, // default false
      tags: props.tags || [], // Type Tag
      created: props.created || "",
      modified: props.modified || "",
      due: props.due || new Date(), // todo REMOVE THIS
      owner: props.owner || "", // User object
      assigned: props.assigned || "", // User object
      approvals: props.approvals || {
        user: "", // uuid user
        answer: "", // default null, true, false
        date: "", // timestamp of approval or rejection
      },
    },
  }
}
