export interface PetProject {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly projectLink: string;
  readonly repoLink: string | null;
  readonly technologies: string[];
  readonly usersCount: number;
}
