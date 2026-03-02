<template>
  <div>
    <h1>{{ $t('hello') }}</h1>
    <p>{{ $t('welcome') }}</p>
    <div>
      <button @click="setLocale('en')">EN</button>
      <button @click="setLocale('de')">DE</button>
    </div>
    <p>Current locale: {{ locale }}</p>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
</script>
