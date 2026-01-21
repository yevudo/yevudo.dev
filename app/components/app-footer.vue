<script setup lang="ts">
  defineProps<{
    profile: Profile;
  }>();
</script>

<template>
  <UFooter class="mt-10">
    <template #left>
      <div>
        <span class="text-sm">
          {{ $t('app.footer.built.with') }}
        </span>
        <a
          href="https://nuxt.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline"
        >
          Nuxt
        </a>
        <span>&</span>
        <a
          href="https://ui.nuxt.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline"
        >
          Nuxt UI
        </a>
      </div>
    </template>
    <template #right>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <span>{{ $t('app.footer.hosted.on') }}</span>
        <span
          class="flex size-6 items-center justify-center rounded-full bg-white"
        >
          <NuxtImg
            class="size-5"
            src="/img/pi.svg"
            :alt="$t('app.footer.raspberry.pi')"
          />
        </span>
        <span>{{ $t('app.footer.hosted.platform') }}</span>
        <span
          class="flex size-6 items-center justify-center rounded-full bg-white"
        >
          <NuxtImg
            class="size-5"
            src="/img/docker.svg"
            :alt="$t('app.footer.docker')"
          />
        </span>
      </div>
    </template>
    <template #bottom>
      <span class="block text-center text-sm">
        {{ new Date().getFullYear() }}
        {{ profile.firstName }} {{ profile.lastName }}
      </span>
    </template>
  </UFooter>
</template>
