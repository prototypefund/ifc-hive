/*
 * we keep a map of all events the app with some documentation, Since we use
 * events for internal communication between components, some events report
 * change of state, others represent a request addressed to a specific actor,
 * e.g. 'asks the http client to get x'
 *
 * @TODO find clear naming policy 
 */
const events = {
  socketJoinRoom: 'socketJoinRoom',
  socketLeaveRoom: 'socketLeaveRoom',
  socketGetProjectData: 'socketGetProjectData',
  data_update: 'data_update',
  saveLocalProjectConfig: 'saveLocalProjectConfig',
  batchDataStart: 'batchDataStart',
  batchDataStop: 'batchDataStop',
  batchDataItemPush: 'batchDataItemPush',
  'store/dispatch': 'store/dispatch',
  widgetConfLoader: 'widgetConfLoader',
  widgetTypeConfLoader: 'widgetTypeConfLoader',
  setLastprojectId: 'setLastProjectId',
  switchProject: 'switchProject',
}
