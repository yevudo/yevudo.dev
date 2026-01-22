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
        {{ $t('card.skills.title') }}
      </h2>
    </template>

    <div class="space-y-4" itemscope itemtype="https://schema.org/Person">
      <div>
        <h3 class="text-md mb-2 font-medium">
          {{ $t('card.skills.frontend.title') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="item in profile.feSkills"
            :key="item"
            color="secondary"
            variant="soft"
            size="lg"
          >
            <span class="p-skill" itemprop="knowsAbout">{{ item }}</span>
          </UBadge>
        </div>
      </div>

      <div>
        <h3 class="text-md mb-2 font-medium">
          {{ $t('card.skills.backend.title') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="item in profile.beSkills"
            :key="item"
            color="secondary"
            variant="soft"
            size="lg"
          >
            <span class="p-skill" itemprop="knowsAbout">{{ item }}</span>
          </UBadge>
        </div>
      </div>

      <div>
        <h3 class="text-md mb-2 font-medium">
          {{ $t('card.skills.tools.title') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="item in profile.tools"
            :key="item"
            color="neutral"
            variant="soft"
            size="lg"
          >
            <span class="p-skill" itemprop="knowsAbout">{{ item }}</span>
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>
