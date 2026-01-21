<script setup lang="ts">
  defineProps<{
    isVisible: boolean;
    employment: EmploymentRecord;
  }>();
</script>

<template>
  <TransitionGroup
    v-if="isVisible"
    name="project-list"
    tag="div"
    class="space-y-4"
    appear
  >
    <div
      v-for="(project, idx) in employment.workProjects"
      :key="`${employment.id}-project-${idx}`"
      class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
      :style="{ '--animation-order': idx }"
    >
      <div class="mb-3">
        <h4 class="p-name mb-1 text-base font-semibold">
          <a
            v-if="project.website"
            :href="project.website"
            class="flex items-center gap-1.5 text-secondary hover:underline dark:text-gray-100 dark:hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ project.name }}
            <UIcon
              name="i-heroicons-arrow-top-right-on-square"
              class="h-4 w-4"
            />
          </a>
          <span v-else class="text-secondary dark:text-gray-100">
            {{ project.name }}
          </span>
        </h4>
        <p class="p-summary text-base text-gray-700 dark:text-gray-300">
          {{ project.description }}
        </p>
      </div>

      <div
        v-if="project.responsibilities && project.responsibilities.length > 0"
        class="mb-3"
      >
        <h5
          class="mb-2 text-sm font-medium text-gray-600 uppercase dark:text-gray-400"
        >
          {{ $t('work.project.responsibilities') }}
        </h5>
        <ul class="space-y-1">
          <li
            v-for="(resp, respIdx) in project.responsibilities"
            :key="respIdx"
            class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <span class="text-primary">•</span>
            <span class="flex-1">{{ resp }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="project.achievements && project.achievements.length > 0"
        class="mb-3"
      >
        <h5
          class="mb-2 text-sm font-medium text-gray-600 uppercase dark:text-gray-400"
        >
          {{ $t('work.project.achievements') }}
        </h5>
        <ul class="space-y-1">
          <li
            v-for="(ach, achIdx) in project.achievements"
            :key="achIdx"
            class="flex gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="mt-0.5 h-4 w-4 shrink-0 text-green-500"
            />
            <span class="flex-1">{{ ach }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="project.technologies && project.technologies.length > 0"
        class="flex flex-wrap gap-2"
      >
        <UBadge
          v-for="tech in project.technologies"
          :key="tech"
          color="secondary"
          variant="soft"
          size="md"
        >
          <span itemprop="knowsAbout">{{ tech }}</span>
        </UBadge>
      </div>
    </div>
  </TransitionGroup>
</template>

<style scoped>
  .project-list-enter-active {
    animation: slideIn 0.6s ease-out both;
    animation-delay: calc(var(--animation-order) * 0.15s);
  }

  .project-list-leave-active {
    animation: slideOut 0.4s ease-in forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project-list-enter-active,
    .project-list-leave-active {
      animation: none;
    }
  }
</style>
