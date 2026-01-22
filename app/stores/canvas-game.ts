import { defineStore } from 'pinia';
import { CanvasGameStatus } from '~/utils/enums/canvas-game-status';
import type { LeaderboardRecordDtoGet } from '#shared/types/leaderboard-record-dto-get';
import type { LeaderboardRecordDtoPost } from '#shared/types/leaderboard-record-dto-post';

export const useCanvasGameStore = defineStore('canvas-game', {
  state: () => ({
    status: CanvasGameStatus.IDLE,
    dateStart: null as Date | null,
    dateEnd: null as Date | null,
    records: [] as readonly LeaderboardRecordDtoGet[],
    showLeaderboard: false,
    blurBackground: false,
  }),
  actions: {
    onGameStart() {
      this.dateStart = new Date();
      this.status = CanvasGameStatus.STARTED;
      this.blurBackground = true;
    },
    onAllCollected() {
      this.dateEnd = new Date();
      this.status = CanvasGameStatus.ALL_COLLECTED;
      this.showLeaderboard = true;
    },
    onGameComplete() {
      this.status = CanvasGameStatus.COMPLETED;
      this.blurBackground = false;
      this.showLeaderboard = false;
    },
    async submitRecord(
      record: LeaderboardRecordDtoPost
    ): Promise<LeaderboardRecordDtoGet> {
      return $fetch('/api/leaderboard-records', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    },
    async loadRecords(): Promise<void> {
      try {
        this.records = await $fetch<readonly LeaderboardRecordDtoGet[]>(
          '/api/leaderboard-records'
        );
      } catch (error) {
        console.error('Error fetching leaderboard records:', error);
        this.records = [] as readonly LeaderboardRecordDtoGet[];
      }
    },
  },
});
