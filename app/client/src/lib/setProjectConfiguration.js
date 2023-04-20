/*
 * set project configuration
 */
import { globalPages } from '@_/setup/application.js'

/*
 * Browser Config
 */
function setProjectBrowserConfig(project, $store) {
  // early return if we didn't receive project and its configuration
  if (!project || !project.config || !project.config.browser) return
  // Reset all store states which are project dependend. 
  $store.dispatch({ type: 'projectInit' })

  // add global pages and tools from local configuration
  globalPages($store)

  // add browser ui configuration to store
  if (project.config.browser.ui) {
    $store.dispatch({
      type: 'ui/update',
      payload: project.config.browser.ui
    })
  }

  // add pages from project config
  if (project.config.browser.pages && Object.keys(project.config.browser.pages).length > 0) {
    for (const [key, value] of Object.entries(project.config.browser.pages)) {
      $store.dispatch({
        type: "pages/add",
        payload: value,
      });
    }
  }
  // add tools from project config
  if (project.config.browser.tools && Object.keys(project.config.browser.tools).length > 0) {
    for (const [key, value] of Object.entries(project.config.browser.tools)) {
      $store.dispatch({
        type: "toolbar/add",
        payload: value,
      });
    }
  }
  // add navigation tools from project config
  if (project.config.browser.navigationTools && Object.keys(project.config.browser.navigationTools).length > 0) {
    for (const [key, value] of Object.entries(project.config.browser.navigationTools)) {
      $store.dispatch({
        type: "navigationTools/add",
        payload: value,
      });
    }
  }
  // add inspector tools from project config
  if (project.config.browser.inspectorTools && Object.keys(project.config.browser.inspectorTools).length > 0) {
    for (const [key, value] of Object.entries(project.config.browser.inspectorTools)) {
      $store.dispatch({
        type: "inspectorTools/add",
        payload: value,
      });
    }
  }
}

export {
  setProjectBrowserConfig,
}
