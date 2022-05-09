/*
 * This cypress confugrations makes sure that we are using
 * the vite-dev-server and our default vite configuration.
 *
 * See cypress framework configuration
 *    https://docs.cypress.io/guides/component-testing/framework-configuration#Nuxt
 *
 * An vite/vue boilerplate example
 *    https://github.com/cypress-io/cypress-component-examples/tree/main/vite-vue
 */
const path = require('path')
const { startDevServer } = require('@cypress/vite-dev-server')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', 'vite.config.js'),
      },
    })
  })

  return config
}
