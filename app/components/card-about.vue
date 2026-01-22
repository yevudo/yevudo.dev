<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();

  const { blurBackground } = storeToRefs(useCanvasGameStore());
</script>

<template>
  <UCard
    class="transition-all duration-500 ease-in-out"
    :class="{
      'bg-white dark:bg-gray-900': !blurBackground,
      'bg-white/60 backdrop-blur-sm dark:bg-gray-900/60': blurBackground,
    }"
  >
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
