import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LANGS } from '../site.config.mjs';

const localizedString = () =>
  z.object(Object.fromEntries(LANGS.map((l) => [l, z.string().min(1)])) as Record<(typeof LANGS)[number], z.ZodString>);

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      company: z.string(),
      period: localizedString(),
      role: localizedString(),
      story: localizedString(),
      stack: z.array(z.string()).min(1),
      storeLinks: z
        .object({ playStore: z.url().optional(), appStore: z.url().optional(), web: z.url().optional() })
        .default({}),
      status: z.enum(['live', 'delisted', 'internal']).default('live'),
      screenshots: z.array(image()).min(1).max(4),
      accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      order: z.number().int(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    externalUrl: z.url().optional(),
    publisher: z.string().optional(),
  }),
});

export const collections = { apps, blog };
