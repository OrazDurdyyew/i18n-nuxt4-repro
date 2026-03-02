# `defineI18nLocale` fails in production SSR — `useNuxtApp is not defined`

## Environment

- **nuxt**: `^4.3.0`
- **@nuxtjs/i18n**: `^10.2.3`
- **Node**: 20+

## Description

`defineI18nLocale()` works correctly in **dev mode** but throws `useNuxtApp is not defined` in **production SSR** (`nuxt build && nuxt preview`).

This makes it impossible to use any Nuxt context (Pinia stores, runtime config, plugins) inside `defineI18nLocale`, which is required when translations are loaded dynamically from an external source (Redis, database, headless CMS, API).

## Steps to reproduce

```bash
npm install

# 1. Dev mode — works fine
npm run dev
# Open http://localhost:3000 — translations load correctly

# 2. Production — fails
npm run build
npm run preview
# Open http://localhost:3000 — fallback/empty translations, server logs show:
# "Failed to merge messages: Failed loading locale (en): useNuxtApp is not defined"
```

## Expected behavior

`defineI18nLocale` callback should have access to `useNuxtApp()` in production SSR, same as in dev mode.

## Actual behavior

In production SSR, the i18n module uses a different code path:

- **Dev**: `loadMessagesFromClient(locale)` → calls locale loaders directly in Nuxt SSR context → `useNuxtApp()` works
- **Prod**: `loadMessagesFromServer(locale)` → internal `$fetch('/_i18n/:hash/:locale/messages.json')` → Nitro server route handler → `shared/messages.js` calls `useNuxtApp()` → **FAILS** (no Nuxt app context in Nitro route handler)

The decision is hardcoded in `@nuxtjs/i18n/dist/runtime/context.js`:

```js
loadMessages: async (locale) => {
  return ctx.dynamicResourcesSSG || import.meta.dev
    ? await loadMessagesFromClient(locale)   // dev only
    : await loadMessagesFromServer(locale);  // prod SSR — always this path
}
```

There is no configuration option to force `loadMessagesFromClient` in production SSR.

## Use case

We store translations in Redis (multi-tenant app, translations managed via CMS). The `defineI18nLocale` callback needs `useNuxtApp()` to access Pinia stores that are populated with Redis data during SSR middleware. This is a common pattern for apps with dynamic/user-managed translations.

## Workaround

Intercept `/_i18n` requests in a Nitro server middleware before they reach the broken i18n handler, and serve translations from an in-memory `Map` cache populated during earlier middleware execution. This bypasses the Nitro route handler entirely.
