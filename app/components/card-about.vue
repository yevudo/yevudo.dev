<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">
        {{ $t('card.about.title') }}
      </h2>
    </template>
    <p
      class="p-note text-base leading-relaxed text-gray-600 dark:text-gray-400"
      itemprop="description"
    >
      {{ profile.about }}
    </p>
  </UCard>
</template>
