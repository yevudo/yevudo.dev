<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();

  const colorMode = useColorMode();

  const profileImageSrc = ref('/img/profile-light.png');

  const toggleProfileImageSrc = (colorMode: string) => {
    profileImageSrc.value =
      colorMode === 'dark' ? '/img/profile-dark.png' : '/img/profile-light.png';
  };
  onMounted(() => {
    toggleProfileImageSrc(colorMode.value);
  });

  watch(
    () => colorMode.value,
    (newValue) => {
      toggleProfileImageSrc(newValue);
    }
  );
</script>

<template>
  <UCard class="h-card" itemscope itemtype="https://schema.org/Person">
    <template #header>
      <NuxtImg
        class="u-photo mx-auto mb-2 block size-40 rounded-full"
        :src="profileImageSrc"
        :alt="`${profile.firstName} ${profile.lastName} - ${profile.title}`"
        itemprop="image"
        width="160"
        height="160"
        loading="eager"
      />
      <h1 class="flex justify-center gap-1 text-2xl font-bold">
        <span class="p-given-name" itemprop="givenName">
          {{ profile.firstName }}
        </span>
        <span class="p-family-name" itemprop="familyName">
          {{ profile.lastName }}
        </span>
      </h1>
      <p class="text-center text-lg text-gray-600 dark:text-gray-400">
        <span class="p-job-title" itemprop="jobTitle">
          {{ profile.title }}
        </span>
      </p>
      <p class="text-base text-gray-500 dark:text-gray-500">
        {{ profile.experience }}
      </p>
    </template>

    <div
      class="p-adr mb-3 flex items-center gap-2"
      itemprop="address"
      itemscope
      itemtype="https://schema.org/PostalAddress"
    >
      <UIcon
        name="i-heroicons-map-pin"
        class="text-gray-500"
        aria-hidden="true"
      />
      <span class="p-locality" itemprop="addressLocality">
        {{ profile.location }}
      </span>
    </div>

    <USeparator class="my-4" />

    <div class="space-y-3">
      <h2
        class="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
      >
        {{ $t('card.profile.contacts') }}
      </h2>

      <a
        :href="profile.contacts.telegram"
        class="u-url flex w-min items-center gap-2 transition-colors hover:text-primary"
        itemprop="sameAs"
        target="_blank"
        rel="noopener noreferrer me"
      >
        <UIcon name="i-simple-icons-telegram" aria-hidden="true" />
        <span class="text-base">
          {{ $t('card.profile.telegram') }}
        </span>
      </a>

      <a
        :href="`mailto:${profile.contacts.email}`"
        class="u-email flex w-min items-center gap-2 transition-colors hover:text-primary"
        itemprop="email"
      >
        <UIcon name="i-heroicons-envelope" aria-hidden="true" />
        <span class="text-base">{{ profile.contacts.email }}</span>
      </a>

      <a
        :href="profile.contacts.linkedin"
        class="u-url flex w-min items-center gap-2 transition-colors hover:text-primary"
        itemprop="sameAs"
        target="_blank"
        rel="noopener noreferrer me"
      >
        <UIcon name="i-simple-icons-linkedin" aria-hidden="true" />
        <span class="text-base">
          {{ $t('card.profile.linkedin') }}
        </span>
      </a>

      <a
        :href="profile.contacts.github"
        class="u-url flex w-min items-center gap-2 transition-colors hover:text-primary"
        itemprop="sameAs"
        target="_blank"
        rel="noopener noreferrer me"
      >
        <UIcon name="i-simple-icons-github" aria-hidden="true" />
        <span class="text-base">
          {{ $t('card.profile.github') }}
        </span>
      </a>
    </div>
  </UCard>
</template>
