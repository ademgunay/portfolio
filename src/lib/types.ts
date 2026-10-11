import type { ImageMetadata } from 'astro';
import type { Localized } from '../i18n/ui';

export interface Profile {
  name: string;
  title: Localized<string>;
  tagline: Localized<string>;
  location: Localized<string>;
  email: string;
  summary: Localized<string>;
  links: { linkedin: string; github: string; medium: string };
  languages: { name: Localized<string>; level: Localized<string> }[];
  cvPath: string;
  /** Per-language CV overrides; languages without an entry use `cvPath`. */
  cvPaths?: Partial<Localized<string>>;
  openToOpportunities: boolean;
  photo?: ImageMetadata;
  bio: Localized<string[]>;
}
/** start/end are ISO months 'YYYY-MM'; no end = current role. */
export interface Role { title: Localized<string>; start: string; end?: string }
export interface Job { company: string; location: Localized<string>; roles: Role[]; highlights: Localized<string[]> }
export interface SkillGroup { key: string; items: Localized<string[]> }
