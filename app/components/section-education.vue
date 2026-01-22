<script setup lang="ts">
  import { EducationRecordType } from '#shared/enums/education-record-type';

  const props = defineProps<{
    records: readonly EducationRecord[];
  }>();

  const isCollapsed = ref(true);
  const { locale } = useI18n();

  const recordsComputed = computed(() => {
    return props.records.toSorted((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date();
      const dateB = b.endDate ? new Date(b.endDate) : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  });

  const getIcon = (type: EducationRecord['type']) => {
    switch (type) {
      case EducationRecordType.Degree:
        return 'i-heroicons-academic-cap';
      case EducationRecordType.Course:
        return 'i-heroicons-document-check';
      case EducationRecordType.Training:
        return 'i-heroicons-book-open';
      default:
        return 'i-heroicons-map-pin';
    }
  };

  const getBorderColor = (type: EducationRecord['type']) => {
    switch (type) {
      case EducationRecordType.Degree:
        return 'border-blue-500';
      case EducationRecordType.Course:
        return 'border-green-500';
      case EducationRecordType.Training:
        return 'border-yellow-500';
      default:
        return 'border-purple-500';
    }
  };
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold">
        {{ $t('section.education.title') }}
      </h2>
    </template>

    <div
      class="h-resume space-y-6"
      itemscope
      itemtype="https://schema.org/Person"
    >
      <article
        v-for="(record, index) in recordsComputed"
        v-show="!isCollapsed || index < 3"
        :key="record.id"
        :class="[
          'h-event border-l-2 pb-6 pl-4 last:pb-0',
          getBorderColor(record.type),
        ]"
        itemprop="alumniOf"
        itemscope
        itemtype="https://schema.org/EducationalOrganization"
      >
        <div class="mb-3 flex items-start gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5"
          >
            <UIcon :name="getIcon(record.type)" class="h-5 w-5 text-primary" />
          </div>

          <div class="flex-1">
            <a
              v-if="record.institutionLink"
              :href="record.institutionLink"
              target="_blank"
              rel="noopener noreferrer"
              class="p-org h-card text-lg font-bold transition-colors hover:text-primary"
              itemprop="url"
            >
              <span itemprop="name">{{ record.institution }}</span>
            </a>
            <h3
              v-else
              class="p-org text-lg font-bold"
              itemprop="name"
            >
              {{ record.institution }}
            </h3>

            <p
              v-if="record.degree"
              class="p-name mt-1 font-medium text-gray-700 dark:text-gray-300"
            >
              {{ record.degree }}
            </p>

            <div
              class="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <span class="flex items-center gap-1">
                <UIcon
                  name="i-heroicons-calendar"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                <time
                  v-if="record.startDate"
                  class="dt-start"
                  :datetime="record.startDate"
                >
                  {{ formatDate(record.startDate, locale) }}
                </time>
                <span v-if="record.startDate && record.endDate">-</span>
                <time
                  v-if="record.endDate"
                  class="dt-end"
                  :datetime="record.endDate"
                >
                  {{ formatDate(record.endDate, locale) }}
                </time>
                <span v-else class="dt-end">
                  {{ $t('section.education.present') }}
                </span>
              </span>
              <span v-if="record.location" class="flex items-center gap-1">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                <span class="p-location">
                  {{ record.location }}
                </span>
              </span>
              <span v-else class="flex items-center gap-1">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
                <span class="p-location">
                  {{ $t('section.education.online') }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <p
          class="p-summary text-base leading-relaxed text-gray-700 dark:text-gray-300"
        >
          {{ record.description }}
        </p>
      </article>

      <div
        v-if="recordsComputed.length > 3"
        class="flex items-center justify-center gap-2 pt-4"
      >
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
            class="h-4 w-4"
          />
          <span v-if="isCollapsed">
            {{ $t('action.show.more') }} ({{ recordsComputed.length - 3 }})
          </span>
          <span v-else>
            {{ $t('action.show.less') }}
          </span>
        </UButton>
      </div>
    </div>
  </UCard>
</template>
