/*
 * inspector tools reducer
 */
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 
import { applicationState } from '../../state'

const reducerMap = {
  'init': () => applicationState.toolbar,
  'projectInit': () => applicationState.toolbar,
  'inspectorTools/add': reducers.inspectorToolsAdd,
  'inspectorTools/update': reducers.inspectorToolsUpdate,
}

export default reducerFromMap(reducerMap)
