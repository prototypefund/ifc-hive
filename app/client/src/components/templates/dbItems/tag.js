export default function (props = {}) {
  return {
    _id: props._id || "",
    _type: "tag",
    _project: props._project || "",
    _title: props._title || "",
    _source: {
      title: props.title || "",
      type: props.type || "", // default, milestone, status, etc.
      locked: props.locked || false,
    },
  }
}
