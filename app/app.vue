<script setup lang="ts">
  import { en } from '@nuxt/ui/locale';
  import { uk } from '@nuxt/ui/locale';

  const { locale } = useI18n();

  const availableUiLocales = {
    en,
    uk,
  };
</script>

<template>
  <UApp :locale="availableUiLocales[locale]">
    <NuxtPage />
  </UApp>
</template>
