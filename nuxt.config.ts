export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
    ],
    defaultLocale: 'en',
  },
})
