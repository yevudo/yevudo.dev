<script setup lang="ts">
  const { t } = useI18n();
  const canvasGameStore = useCanvasGameStore();
  const { submitRecord, loadRecords, onGameComplete } = canvasGameStore;
  const { showLeaderboard, records, dateStart, dateEnd } =
    storeToRefs(canvasGameStore);

  const isLoading = ref(false);
  const submittedRecordId = ref<string | null>(null);
  const username = ref('');
  const modalRef = ref<HTMLDivElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);

  const onSubmitRecord = async () => {
    if (
      !dateEnd.value ||
      !dateStart.value ||
      isLoading.value ||
      submittedRecordId.value
    ) {
      return;
    }
    if (!username.value.trim() || username.value.trim().length > 20) {
      return;
    }
    isLoading.value = true;
    const response = await submitRecord({
      date: new Date().toISOString(),
      username: username.value.trim(),
      timems: dateEnd.value.getTime() - dateStart.value.getTime(),
    }).catch((err) => {
      alert(t('leaderboard.error.submission'));
      console.error('Error submitting leaderboard record:', err);
    });
    if (!response) {
      isLoading.value = false;
      return;
    }
    submittedRecordId.value = response.id;
    await loadRecords();
    isLoading.value = false;
  };

  const formatTime = (timems: number): string => {
    const minutes = Math.floor(timems / 60000);
    const seconds = Math.floor((timems % 60000) / 1000);
    const milliseconds = timems % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(3, '0')}`;
  };

  const onCloseLeaderboard = () => {
    onGameComplete();
    submittedRecordId.value = null;
    username.value = '';
  };

  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.value) return [];
    const elements = modalRef.value.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    return Array.from(elements) as HTMLElement[];
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (submittedRecordId.value) {
        onCloseLeaderboard();
      }
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  watch(showLeaderboard, (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        inputRef.value?.focus();
        document.addEventListener('keydown', handleKeydown);
      });
    } else {
      document.removeEventListener('keydown', handleKeydown);
    }
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<template>
  <Transition
    enter-active-class="animate-slide-down-bounce"
    leave-active-class="transition-all duration-500 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-to-class="-translate-y-[calc(50vh+200px)] opacity-0"
  >
    <div
      v-if="showLeaderboard"
      ref="modalRef"
      class="fixed top-1/2 left-1/2 z-1300 size-100 -translate-x-1/2 -translate-y-1/2 rounded-md bg-yellow-400 p-8 text-center shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div v-if="submittedRecordId" class="flex h-full flex-col">
        <h2 class="mb-4 text-2xl font-bold text-black">
          {{ $t('leaderboard.title') }}
        </h2>
        <div class="flex-1 overflow-y-auto">
          <ul class="space-y-2">
            <li
              v-for="(record, index) in records"
              :key="record.id"
              :class="[
                'flex items-center justify-between rounded-lg px-4 py-3 text-black transition-colors',
                record.id === submittedRecordId
                  ? 'bg-black font-bold text-yellow-400 shadow-lg ring-2 ring-black'
                  : 'bg-white/50',
              ]"
            >
              <div class="flex items-center gap-3">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-full font-bold"
                  :class="
                    record.id === submittedRecordId
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black/10 text-black'
                  "
                >
                  {{ index + 1 }}
                </span>
                <span class="text-lg font-medium">{{ record.username }}</span>
              </div>
              <span class="font-mono text-base font-semibold">
                {{ formatTime(record.timems) }}
              </span>
            </li>
          </ul>
        </div>
        <button
          type="button"
          class="mt-4 cursor-pointer rounded-md bg-black px-6 py-2 text-lg font-semibold text-yellow-400 transition-transform hover:scale-105 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          @click="onCloseLeaderboard"
        >
          <span>{{ $t('leaderboard.close') }}</span>
        </button>
      </div>

      <div
        v-else
        class="flex h-full flex-col items-center justify-center gap-6"
      >
        <div>
          <h2 id="modal-title" class="text-2xl font-bold text-black">
            {{ $t('leaderboard.well.done.player') }}
          </h2>
          <p
            id="modal-description"
            class="mt-2 text-base font-normal text-black/80"
          >
            {{ $t('leaderboard.enter.name') }}
          </p>
        </div>

        <form
          class="flex w-full flex-col items-center gap-4"
          @submit.prevent="onSubmitRecord"
        >
          <label for="username-input" class="sr-only">
            {{ $t('leaderboard.name.label') }}
          </label>
          <input
            id="username-input"
            ref="inputRef"
            v-model="username"
            type="text"
            class="w-full max-w-xs rounded-md border-2 border-black/20 bg-white px-4 py-2 text-center text-lg text-black placeholder-black/50 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            maxlength="20"
            required
            aria-required="true"
          />
          <button
            type="submit"
            class="rounded-md bg-black px-6 py-2 text-lg font-semibold text-yellow-400 transition-transform hover:scale-105 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [not:disabled]:cursor-pointer"
            :disabled="!username.trim() || isLoading"
          >
            <svg
              v-if="isLoading"
              class="inline-block h-6 w-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-else>{{ $t('leaderboard.submit.button') }}</span>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>
