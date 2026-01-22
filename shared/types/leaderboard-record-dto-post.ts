import type { LeaderboardRecordDtoGet } from './leaderboard-record-dto-get';

export type LeaderboardRecordDtoPost = Omit<LeaderboardRecordDtoGet, 'id'> & {
  readonly date: string;
};
