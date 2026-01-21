<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();
</script>

<template>
  <UCard>
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
        <span class="text-base text-gray-500" itemprop="proficiencyLevel">
          {{ lang.level }}
        </span>
      </div>
    </div>
  </UCard>
</template>
