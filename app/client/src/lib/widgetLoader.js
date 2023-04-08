import { mergeDeepRight } from 'ramda'

/*
 * widgetLoader
 * @param { string } widgetName, the name of the widget folder to load a file from
 * @param { string } face, the version of the widget file
 *
 * Load a given widget vue file
 */
const widgetLoader = function (widgetName = 'debug', face = 'default') {
  return import(`../app/components/widgets/${widgetName}/${face}.vue`).catch(e => {
    return import('../app/components/widgets/error/default.vue')
  })
}
/*
 * widgetConfLoader
 * @param { object } widget, the config for a widget
 *
 * get a config file for a given widget and configure its state
 */
const widgetConfLoader = function (store) {
  return (widget) => {
    return import(`../app/components/widgets/${widget.name || 'debug'}/conf.js`).then(conf => {
      const widgetConf = conf[widget.face] || conf.default
      const mergedConf = mergeDeepRight(mergeDeepRight(widgetConf, widget), widget.props || {})
      store.dispatch({
        type: 'widgets/update',
        uuid: widget.uuid,
        payload: mergedConf
      })
    }).catch(e => {
      return e
    })
  }
}

/*
 * widgetTypeConfLoader
 * @param { object } widget, the config for a widget
 *
 * get a config file for a given widget and configure its state
 */
const widgetTypeConfLoader = function (store) {
  return (widget) => {
    return import(`../app/components/widgets/${widget.name || 'debug'}/${widget.type || 'default'}/conf.js`)
      .then(conf => {
        const widgetConf = conf[widget.face] || conf.default
        const mergedConf = mergeDeepRight(mergeDeepRight(widgetConf, widget), widget.props || {})
        store.dispatch({
          type: 'widgets/update',
          uuid: widget.uuid,
          payload: mergedConf
        })
      }).catch(e => {
        return widgetConfLoader(widget)
      })
  }
}


export {
  widgetLoader,
  widgetConfLoader,
  widgetTypeConfLoader,
}
