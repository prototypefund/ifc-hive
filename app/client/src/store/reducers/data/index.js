/*
 * data reducer
 */
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 

const reducerMap = {
  'init': reducers.init,
  'projectInit': reducers.projectInit,
  'data/push': reducers.dataPush,
  'data/update': reducers.dataUpdate,
  'data/delete': reducers.dataDelete,
  'data/clear': reducers.dataClear,
}

export default reducerFromMap(reducerMap)
