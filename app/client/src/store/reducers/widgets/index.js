import { applicationState } from '../../state'
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 

const reducerMap = {
  'init': () => applicationState.widgets,
  'projectInid': () => applicationState.widgets,
  'widgets/update': reducers.widgetsUpdate,
  'widgets/add': reducers.widgetsAdd,
}

export default reducerFromMap(reducerMap)
