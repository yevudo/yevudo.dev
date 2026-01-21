import type { WorkProject } from './work-project';

export interface EmploymentRecord {
  readonly id: string;
  readonly position: string;
  readonly company: {
    readonly name: string;
    readonly website: string | null;
    readonly logo: string;
  };
  readonly location: string;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly workProjects: readonly WorkProject[];
}
