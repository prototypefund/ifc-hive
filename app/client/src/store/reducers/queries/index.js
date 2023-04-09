/*
 * queries reducer
 */
import { applicationState } from '../../state'
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 

const reducerMap = {
  'init': () => applicationState.queries,
  'queries/execute': reducers.queriesExecute,
  'queries/add': reducers.queriesAdd,
  'queries/remove': reducers.queriesRemove,
}

export default reducerFromMap(reducerMap)

