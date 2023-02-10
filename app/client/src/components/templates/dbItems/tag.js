export default function (props) {
  return {
    _id: "",
    _type: "tag",
    _project: "",
    _title: "",
    _source: {
      title: "",
      type: "", // default, milestone, status, etc.
      locked: false,
    },
  }
}
