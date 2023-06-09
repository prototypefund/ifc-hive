import { app } from '@storybook/vue3'
import store from '../src/store/index.js'
import i18n from '../src/setup/i18n.js'
import vuetify from '../src/setup/vuetify.js'
import axios from 'axios'
import filters from '../src/setup/filters.js'
import { themes } from '@storybook/theming';

export const parameters = {
    darkMode: {
        // Override the default dark theme
        dark: { ...themes.dark, appBg: 'black' },
        // Override the default light theme
        light: { ...themes.normal },
        current: 'dark'
    }
};

app.use(i18n)
app.use(vuetify)

app.provide('$api', axios)
app.config.globalProperties.$filters = filters
app.config.globalProperties.$api = axios
// make store availble in all components
app.provide('$store', store)
