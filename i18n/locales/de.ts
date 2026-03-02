export default defineI18nLocale(async (_locale) => {
  const nuxtApp = useNuxtApp()
  console.log('[i18n] useNuxtApp() available:', !!nuxtApp)

  return {
    hello: 'Hallo Welt',
    welcome: 'Willkommen in der App',
  }
})
