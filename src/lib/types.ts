import type { ImageMetadata } from 'astro';

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  summary: string;
  links: { linkedin: string; github: string; medium: string };
  languages: { name: string; level: string }[];
  cvPath: string;
  openToOpportunities: boolean;
  photo?: ImageMetadata;
  bio: string[];
}
export interface Role { title: string; start: string; end: string }
export interface Job { company: string; location: string; roles: Role[]; highlights: string[] }
export interface SkillGroup { key: string; items: string[] }
