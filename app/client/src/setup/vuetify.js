import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles' // Global CSS has to be imported
import '@mdi/font/css/materialdesignicons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { locale } from './i18n.js'

const theme = {
  dark: true,
  colors: {
    background: '#1F1E24',
    surface: '#333238',
    primary: '#FEBE33',
    secondary: '#4C89A5',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export const vuetify = createVuetify({
  locale,
  components,
  directives,
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
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
