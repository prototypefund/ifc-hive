function tagMapper (doc) {
  return {
    id: doc._id,
    project: doc.project,
    title: doc.title,
    type: doc.type,
    isDeleted: doc.isDeleted,
  }
}

export default tagMapper
export { tagMapper }
