<script setup lang="ts">
  const props = defineProps<{
    records: readonly EmploymentRecord[];
  }>();

  const recordsComputed = computed(() => {
    return props.records.toSorted((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date();
      const dateB = b.endDate ? new Date(b.endDate) : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  });

  const isCollapsed = ref(true);
  const expandedProjects = ref(new Set<string>());
  const { locale, t } = useI18n();

  const recordsVisible = computed(() => {
    return isCollapsed.value
      ? recordsComputed.value.slice(0, 3)
      : recordsComputed.value;
  });

  const getAnimationOrder = (index: number) => {
    return isCollapsed.value ? index : Math.max(0, index - 3);
  };

  const toggleProjects = (recordId: string) => {
    if (expandedProjects.value.has(recordId)) {
      expandedProjects.value.delete(recordId);
    } else {
      expandedProjects.value.add(recordId);
    }
    expandedProjects.value = new Set(expandedProjects.value);
  };

  const getDuration = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (endDate.getDate() < startDate.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    let yearPart = '';
    if (years > 0) {
      if (years === 1) {
        yearPart = `${years} ${t('year.count', 0)}`;
      } else if (years >= 2 && years <= 4) {
        yearPart = `${years} ${t('year.count', 1)}`;
      } else {
        yearPart = `${years} ${t('year.count', 2)}`;
      }
    }
    let monthPart = '';
    if (months > 0) {
      if (months === 1) {
        monthPart = `${months} ${t('month.count', 0)}`;
      } else if (months >= 2 && months <= 4) {
        monthPart = `${months} ${t('month.count', 1)}`;
      } else {
        monthPart = `${months} ${t('month.count', 2)}`;
      }
    }

    return [yearPart, monthPart].filter(Boolean).join(' ');
  };
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold">
        {{ $t('section.experience.title') }}
      </h2>
    </template>

    <div
      class="h-resume space-y-8"
      itemscope
      itemtype="https://schema.org/Person"
    >
      <TransitionGroup
        name="employment-list"
        tag="div"
        class="space-y-8"
        appear
      >
        <article
          v-for="(record, index) in recordsVisible"
          :key="record.id"
          class="h-event border-l-2 border-primary pb-6 pl-4 last:pb-0"
          itemprop="worksFor"
          itemscope
          itemtype="https://schema.org/OrganizationRole"
          :style="{ '--animation-order': getAnimationOrder(index) }"
        >
          <div class="mb-3">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="p-name mb-1 text-lg font-bold" itemprop="roleName">
                  {{ record.position }}
                </h3>
                <div
                  class="p-location h-card mb-2 flex items-center gap-2"
                  itemprop="worksFor"
                  itemscope
                  itemtype="https://schema.org/Organization"
                >
                  <a
                    v-if="record.company.website"
                    :href="record.company.website"
                    class="p-org flex items-center gap-1 font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    itemprop="url"
                  >
                    <span itemprop="name">{{ record.company.name }}</span>
                    <UIcon
                      name="i-heroicons-arrow-top-right-on-square"
                      class="h-3.5 w-3.5"
                    />
                  </a>
                  <span
                    v-else
                    class="p-org font-medium text-primary"
                    itemprop="name"
                  >
                    {{ record.company }}
                  </span>
                </div>
              </div>

              <img
                v-if="record.company.logo"
                :src="record.company.logo"
                :alt="`${record.company.name} logo`"
                class="h-12 w-12 rounded bg-white object-contain p-1 dark:bg-gray-800"
                loading="lazy"
              />
            </div>

            <div
              class="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <span class="flex items-center gap-1">
                <UIcon
                  name="i-heroicons-calendar"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                <time
                  class="dt-start"
                  :datetime="record.startDate"
                  itemprop="startDate"
                >
                  {{ formatDate(record.startDate, locale) }}
                </time>
                -
                <time
                  v-if="record.endDate"
                  class="dt-end"
                  :datetime="record.endDate"
                  itemprop="endDate"
                >
                  {{ formatDate(record.endDate, locale) }}
                </time>
                <span v-else class="dt-end">
                  {{ $t('section.experience.now') }}
                </span>
                <span v-if="record.endDate">
                  ({{ getDuration(record.startDate, record.endDate) }})
                </span>
              </span>
              <span class="p-location flex items-center gap-1">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                <span
                  itemprop="location"
                  itemscope
                  itemtype="https://schema.org/Place"
                >
                  <span itemprop="name">{{ record.location }}</span>
                </span>
              </span>
            </div>
          </div>

          <div
            v-if="record.workProjects && record.workProjects.length > 0"
            class="mt-4"
          >
            <UButton
              :aria-label="
                expandedProjects.has(record.id)
                  ? $t('action.hide.projects')
                  : $t('action.show.projects')
              "
              color="neutral"
              variant="soft"
              size="sm"
              class="mb-3 cursor-pointer"
              :aria-expanded="expandedProjects.has(record.id)"
              @click="toggleProjects(record.id)"
            >
              <UIcon
                name="i-heroicons-chevron-down"
                class="mr-2 h-4 w-4 transition-transform duration-300"
                :class="{ '-rotate-180': expandedProjects.has(record.id) }"
              />
              <span v-if="!expandedProjects.has(record.id)">
                {{ $t('action.show.projects') }}
                ({{ record.workProjects.length }})
              </span>
              <span v-else>
                {{ $t('action.hide.projects') }}
              </span>
            </UButton>
            <WorkProjects
              :is-visible="expandedProjects.has(record.id)"
              :employment="record"
            />
          </div>
        </article>
      </TransitionGroup>

      <div v-if="records.length > 3" class="flex justify-center">
        <UButton
          :aria-label="
            isCollapsed ? $t('action.show.more') : $t('action.show.less')
          "
          color="neutral"
          variant="soft"
          size="md"
          class="cursor-pointer"
          :aria-expanded="!isCollapsed"
          @click="isCollapsed = !isCollapsed"
        >
          <UIcon
            name="i-heroicons-chevron-down"
            class="mr-2 h-4 w-4 transition-transform duration-300"
            :class="{ '-rotate-180': !isCollapsed }"
          />
          <span v-if="isCollapsed">
            {{ $t('action.show.more') }} ({{ records.length - 3 }})
          </span>
          <span v-else>
            {{ $t('action.show.less') }}
          </span>
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
  .employment-list-enter-active {
    animation: slideIn 0.6s ease-out both;
    animation-delay: calc(var(--animation-order) * 0.15s);
  }

  .employment-list-leave-active {
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
    .employment-list-enter-active,
    .employment-list-leave-active {
      animation: none;
    }
  }
</style>
