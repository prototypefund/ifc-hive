/*
 * toolLoader
 *
 * @param { string } widgetName, the name of the widget folder to load a file from
 * @param { string } toolType, a subfolder containing the face files for the tool. If false it won't be used
 * @param { string } face, the version of the widget file
 *
 * Load a given widget vue file for the usage within the toolbar
 */
export default function (widgetName = 'debug', toolType = false, face = 'default') {
  if (!toolType) {
    return import(`../app/components/widgets/${widgetName}/${face}.vue`).catch(e => {
      return import('../app/components/widgets/error/default.vue')
    })
  } else {
    return import(`../app/components/widgets/${widgetName}/${toolType}/${face}.vue`).catch(e => {
      return import('../app/components/widgets/error/default.vue')
    })
  }

}
