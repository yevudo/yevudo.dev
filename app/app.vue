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
  <CanvasGame />
  <div class="relative z-10">
    <UApp :locale="availableUiLocales[locale]">
      <NuxtPage />
    </UApp>
  </div>
</template>
