import { createI18n, useI18n } from 'vue-i18n'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import messages from '../i18n/messages'
import datetimeFormats from '../i18n/dateTimeFormats'

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  globalInjection: true,
  locale: (navigator.language || navigator.userLanguage).split('-')[0], // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  datetimeFormats
})

const locale = {
  adapter: createVueI18nAdapter({
    i18n,
    useI18n,
  })
}

export default i18n

export {
  i18n,
  locale
}
