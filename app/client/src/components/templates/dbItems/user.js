export default function (props) {
  return {
    _id: "",
    _type: "user",
    _path: "",
    _title: "", // Nickname (email)  Organization
    _source: {
      firstname: "",
      lastname: "",
      nickname: "",
      email: "",
      organisation: "", // Type organization
      active: "",
    },
  }
}
