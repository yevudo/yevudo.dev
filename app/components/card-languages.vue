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
        {{ $t('card.languages.title') }}
      </h2>
    </template>

    <div class="space-y-3" itemscope itemtype="https://schema.org/Person">
      <div
        v-for="(lang, idx) in profile.spokenLanguages"
        :key="idx"
        class="flex items-center justify-between"
        itemprop="knowsLanguage"
        itemscope
        itemtype="https://schema.org/Language"
      >
        <span class="p-skill text-base font-medium" itemprop="name">
          {{ lang.name }}
        </span>
        <span class="text-base text-gray-500">
          {{ lang.level }}
        </span>
      </div>
    </div>
  </UCard>
</template>
