import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles' // Global CSS has to be imported
import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { locale } from './i18n.js'

const custom = {
  primary: '#FEBE33',
  light: {

  },
  dark: {
    background: '#1F1E24',
    surface: '#333238',
  }
}
const dark = {
  dark: true,
  colors: {
    background: custom.dark.background,
    surface: custom.dark.surface,
    primary: custom.primary,
    secondary: '#4C89A5',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}
const light = {
  dark: false,
  colors: {
    primary: custom.primary,
  }
}

export const vuetify = createVuetify({
  locale,
  components,
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
