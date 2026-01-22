import type { LeaderboardRecordDtoGet } from '#shared/types/leaderboard-record-dto-get';

const config = useRuntimeConfig();

export default defineEventHandler(async () => {
  try {
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/leaderboard-records`
    );
    const records = await response.json();
    return records as readonly LeaderboardRecordDtoGet[];
  } catch (error) {
    console.error('Error fetching leaderboard records:', error);
    return [] as readonly LeaderboardRecordDtoGet[];
  }
});
