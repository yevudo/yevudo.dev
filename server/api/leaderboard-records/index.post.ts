import type { LeaderboardRecordDtoGet } from '#shared/types/leaderboard-record-dto-get';
import type { LeaderboardRecordDtoPost } from '#shared/types/leaderboard-record-dto-post';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LeaderboardRecordDtoPost>(event);
    if (!body) {
      createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }
    if (body.timems <= 0 || !body.username) {
      createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }
    if (body.username.length > 20) {
      createError({ statusCode: 400, statusMessage: 'Username too long' });
    }
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      createError({ statusCode: 400, statusMessage: 'Invalid date format' });
    }
    const response = await fetch(
      `http://${config.databaseApiHost}:${config.databaseApiPort}/api/leaderboard-records`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const recordNew = await response.json();
    return recordNew as LeaderboardRecordDtoGet;
  } catch (error) {
    console.error('Error posting leaderboard records:', error);
    createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
