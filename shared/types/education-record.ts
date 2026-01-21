import type { EducationRecordType } from '#shared/enums/education-record-type';
export interface EducationRecord {
  readonly id: string;
  readonly type: EducationRecordType;
  readonly location: string | null;
  readonly institution: string;
  readonly institutionLink: string | null;
  readonly degree?: string;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly description: string;
}
