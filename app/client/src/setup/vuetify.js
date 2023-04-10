/*
 * Set up vuetify instance
 */
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VVirtualScroll } from 'vuetify/labs/VVirtualScroll'
import 'vuetify/styles' // Global CSS has to be imported
import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { locale } from './i18n.js'
import lightTheme from '../styles/themes/light.js'
import darkTheme from '../styles/themes/dark.js'

const dark = {
  dark: true,
  colors: darkTheme
}

const light = {
  dark: false,
  colors: lightTheme
}

const vuetify = createVuetify({
  locale,
  components: {
    ...components,
    VVirtualScroll
  },
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark,
      light
    }
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 340,
      md: 540,
      lg: 800,
      xl: 1280,
    },
  },
})

export default vuetify
export {
  vuetify
}
