
const reducerFromMap = (reducerMap) => (state, action) => {
  if (!state) return

  return reducerMap[action.type] 
    ? reducerMap[action.type](state, action)
    : state
}

export default reducerFromMap
export { reducerFromMap }
