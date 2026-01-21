<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();

  const { locale, t } = useI18n();
  const switchLocalePath = useSwitchLocalePath();

  const { locales } = useI18n();

  const availableLocales = computed(() => {
    return locales.value.filter((i) => i.code !== locale.value);
  });
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <UTooltip :text="$t('app.header.download.cv')">
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-arrow-down-tray"
          external
          :aria-label="$t('app.header.download.cv')"
          :href="`yevhen-udovychenko-cv-${locale}.pdf`"
          download
          target="_blank"
        >
          {{ $t('app.header.download.cv') }}
        </UButton>
      </UTooltip>
    </template>
    <template #right>
      <UTooltip :text="$t('app.header.switch.theme')">
        <UColorModeButton class="cursor-pointer" />
      </UTooltip>
      <UTooltip
        v-for="loc in availableLocales"
        :key="loc.code"
        :text="`${$t('app.header.switch.language')}: ${loc.name}`"
      >
        <UButton
          color="neutral"
          variant="ghost"
          :to="switchLocalePath(loc.code)"
          :aria-label="`${t('app.header.switch.language')}: ${loc.name}`"
        >
          {{ loc.code.toUpperCase() }}
        </UButton>
      </UTooltip>
    </template>
  </UHeader>
</template>
