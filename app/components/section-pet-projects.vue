<script setup lang="ts">
  defineProps<{
    petProjects: readonly PetProject[];
  }>();

  const isCollapsed = ref(true);

  const formatUsers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

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
      <h2 class="text-xl font-semibold">
        {{ $t('section.pet.projects.title') }}
      </h2>
    </template>

    <div class="h-resume space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article
          v-for="(project, index) in petProjects"
          v-show="!isCollapsed || index < 4"
          :key="project.id"
          class="h-entry group rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:border-primary hover:shadow-lg dark:border-gray-700"
          itemscope
          itemtype="https://schema.org/SoftwareApplication"
        >
          <meta itemprop="operatingSystem" content="Web" />
          <div class="mb-3 flex items-start justify-between gap-2">
            <h3
              class="p-name flex-1 text-base font-bold transition-colors group-hover:text-primary"
            >
              <span itemprop="name">{{ project.name }}</span>
            </h3>
            <UBadge
              v-if="project.usersCount > 0"
              color="neutral"
              variant="soft"
              size="sm"
              class="shrink-0"
            >
              <UIcon name="i-heroicons-user-group" class="mr-1 h-3 w-3" />
              <span itemprop="interactionCount">
                {{ formatUsers(project.usersCount) }}
              </span>
            </UBadge>
          </div>

          <p
            class="p-summary mb-4 text-base leading-relaxed text-gray-600 dark:text-gray-400"
          >
            <span itemprop="description">{{ project.description }}</span>
          </p>

          <div class="mb-4 flex flex-wrap gap-1.5">
            <UBadge
              v-for="tech in project.technologies"
              :key="tech"
              color="secondary"
              variant="soft"
              size="md"
            >
              <span itemprop="applicationCategory">{{ tech }}</span>
            </UBadge>
          </div>

          <div
            class="flex gap-3 border-t border-gray-100 pt-3 dark:border-gray-800"
          >
            <a
              :href="project.projectLink"
              target="_blank"
              rel="noopener noreferrer"
              class="u-url group/link flex items-center gap-1.5 text-base font-medium text-primary hover:underline"
              itemprop="url"
            >
              <UIcon
                name="i-heroicons-arrow-top-right-on-square"
                class="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
              {{ $t('action.view') }}
            </a>
            <a
              v-if="project.repoLink"
              :href="project.repoLink"
              target="_blank"
              rel="noopener noreferrer"
              class="u-url group/link flex items-center gap-1.5 text-base font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              itemprop="codeRepository"
            >
              <UIcon
                name="i-simple-icons-github"
                class="h-4 w-4 transition-transform group-hover/link:scale-110"
              />
              {{ $t('section.pet.projects.source') }}
            </a>
          </div>
        </article>
      </div>

      <div v-if="petProjects.length > 4" class="flex justify-center pt-4">
        <UButton
          color="neutral"
          variant="soft"
          size="md"
          :aria-label="
            isCollapsed ? $t('action.show.more') : $t('action.show.less')
          "
          :aria-expanded="!isCollapsed"
          @click="isCollapsed = !isCollapsed"
        >
          <UIcon
            :name="
              isCollapsed
                ? 'i-heroicons-chevron-down'
                : 'i-heroicons-chevron-up'
            "
            class="mr-2 h-4 w-4"
          />
          <span v-if="isCollapsed">
            {{ $t('action.show.more') }} ({{ petProjects.length - 4 }})
          </span>
          <span v-else>
            {{ $t('action.show.less') }}
          </span>
        </UButton>
      </div>
    </div>
  </UCard>
</template>
