import type { SpokenLanguage } from './spoken-language';

export interface Profile {
  readonly firstName: string;
  readonly lastName: string;
  readonly title: string;
  readonly experience: string;
  readonly location: string;
  readonly contacts: {
    readonly email: string;
    readonly linkedin: string;
    readonly github: string;
    readonly telegram: string;
  };
  readonly about: string;
  readonly feSkills: readonly string[];
  readonly beSkills: readonly string[];
  readonly tools: readonly string[];
  readonly spokenLanguages: readonly SpokenLanguage[];
}
