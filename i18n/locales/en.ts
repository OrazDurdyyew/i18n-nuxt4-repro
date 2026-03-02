export default defineI18nLocale(async (_locale) => {
  // Works in dev, throws "useNuxtApp is not defined" in production SSR.
  // In prod, i18n calls loadMessagesFromServer() which runs this callback
  // inside a Nitro route handler where Nuxt app context does not exist.
  // Simulates loading translations from an external source (API, Redis, CMS).
  // In a real app this would be reading from Redis, database, headless CMS, etc.
  //
  // useNuxtApp() is needed to access Pinia stores, runtime config, or other
  // Nuxt-provided context for determining which translations to load.

  const nuxtApp = useNuxtApp()
  console.log('[i18n] useNuxtApp() available:', !!nuxtApp)

  return {
    hello: 'Hello World',
    welcome: 'Welcome to the app',
  }
})
