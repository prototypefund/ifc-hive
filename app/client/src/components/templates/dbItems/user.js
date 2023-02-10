export default function (props = {}) {
  return {
    _id: props._id || "",
    _type: "user",
    _path: props._path || "",
    _title: props._title || "", // Nickname (email)  Organization
    _source: {
      firstname: props.firstname || "",
      lastname: props.lastname || "",
      nickname: props.nickname || "",
      email: props.email || "",
      organisation: props.organisation || "", // Type organization
      active: props.active || false,
      tags: props.tags || [],
      avatar: props.avatar || {
        file: "",
        mimetype: "",
        size: 0,
        originalName: "",
      },
    },
  }
}
