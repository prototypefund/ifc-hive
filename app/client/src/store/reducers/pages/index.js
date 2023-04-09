/*
 * pages reducer
 */
import * as reducer from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 
import { applicationState } from '../../state'

const reducerMap = {
  'init': () => applicationState.pages,
  'projectInit': () => applicationState.pages,
  'pages/add': reducer.pagesAdd,
  'pages/update': reducer.pagesUpdate
}

export default reducerFromMap(reducerMap)
