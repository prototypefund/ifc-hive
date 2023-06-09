/*
 * data reducers
 */
import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'
import { getSource } from "@lib/dataHelper.js";

const deepFreeze = (obj1) => {
  Object.keys(obj1).forEach((property) => {
    if (
      typeof obj1[property] === "object" &&
      !Object.isFrozen(obj1[property])
    )
      deepFreeze(obj1[property]);
  });
  return Object.freeze(obj1);
};
/*
 * init
 */
function init(state, action) {
  window.$pacificoData = {}
  return applicationState.data
}

/*
 * project init
 */
function projectInit(state, action) {
  window.$pacificoData = {}
  return applicationState.data
}

/*
 * data push
 */
function dataPush(state, action) {
  const { $eventbus } = action.meta
  const initialData = action.payload.initialData || false
  // early return if no data
  if (!action.payload.data) return state
  const data = JSON.parse(JSON.stringify(state))
  action.payload.data.forEach(item => {
    if (item._type === 'delete') {
      delete window.$pacificoData[item._id]
      delete data[item._id]
    } else {
      data[item._id] = {
        _id: item._id,
        _type: item._type,
        _disId: item._disId,
        _title: item._title
      }
      // add full object to window for lookup
      window.$pacificoData[item._id] = deepFreeze(item)
    }
  })
  if (!initialData) {
    $eventbus.emit('storeDispatch', {
      type: 'notifications/add',
      payload: {
        event: 'push',
        message: `we've received ${action.payload.data.length} new Items for you!`
      }
    })
    $eventbus.emit('storeDispatch', {
      type: 'queries/execute',
      actionId: false
    })
  }

  return data
}

/*
 * data update
 */
function dataUpdate(state, action) {
  const { $eventbus } = action.meta
  let item
  if (action.docUUID) {
    // @TODO review the differentiation between new and existing docs
    if (state[action.docUUID]) {
      // get the meta data from our dataStore
      item = JSON.parse(JSON.stringify(state[action.docUUID]))
      // retrieve the _source from our window store
      item._source = getSource(action.docUUID)
    } else {
      // create a new doc
      item = JSON.parse(JSON.stringify(action.objectDefinition))
    }
    item._source = mergeDeepRight(item._source, action.payload)
    $eventbus.emit('data_update', item)
  }
  if (!action.docUUID) {
    console.error("no docUUID given")
  }
  return state
}

function dataDelete(state, action) {
  console.error("data/delete not implemented")
  return state
}

function dataClear(state, action) {
  console.error("data/clear not implemented")
  return state
}

export {
  init,
  projectInit,
  dataPush,
  dataUpdate,
  dataDelete,
  dataClear,
}
