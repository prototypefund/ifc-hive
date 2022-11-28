/*
 * widgetLoader
 * @param { string } widgetName, the name of the widget folder to load a file from
 * @param { string } face, the version of the widget file
 *
 * Load a given widget vue file
 */
export default function (widgetName = 'debug', face = 'default') {
    return import(`../components/widgets/${widgetName}/${face}.vue`).catch(e => {
        return import('../components/widgets/error/default.vue')
    })
}
