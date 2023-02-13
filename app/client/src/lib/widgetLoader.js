import store from '../store/index.js'
import { mergeDeepRight } from 'ramda'
/*
 * widgetLoader
 * @param { string } widgetName, the name of the widget folder to load a file from
 * @param { string } face, the version of the widget file
 *
 * Load a given widget vue file
 */
export const widgetLoader = function (widgetName = 'debug', face = 'default') {
    return import(`../components/widgets/${widgetName}/${face}.vue`).catch(e => {
        return import('../components/widgets/error/default.vue')
    })
}
/*
 * widgetConfLoader
 * @param { object } widget, the config for a widget
 *
 * get a config file for a given widget and configure its state
 */
export const widgetConfLoader = function (widget) {
    return import(`../components/widgets/${widget.name || 'debug'}/conf.js`).then(conf => {
        const widgetConf = conf[widget.face] || conf.default
        const mergedConf = mergeDeepRight(mergeDeepRight(widgetConf, widget), widget.props || {})
        mergedConf.props = false
        store.dispatch({
            type: 'widgets/update',
            uuid: widget.uuid,
            payload: mergedConf
        })
    }).catch(e => {
        return e
    })
}
/*
 * widgetTypeConfLoader
 * @param { object } widget, the config for a widget
 *
 * get a config file for a given widget and configure its state
 */
export const widgetTypeConfLoader = function (widget) {
    return import(`../components/widgets/${widget.name || 'debug'}/${widget.type || 'default'}/conf.js`).then(conf => {
        const widgetConf = conf[widget.face] || conf.default
        const mergedConf = mergeDeepRight(mergeDeepRight(widgetConf, widget), widget.props || {})
        mergedConf.props = false
        store.dispatch({
            type: 'widgets/update',
            uuid: widget.uuid,
            payload: mergedConf
        })
    }).catch(e => {
        return widgetConfLoader(widget)
    })
}