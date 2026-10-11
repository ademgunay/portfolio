import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { profile } from '../content/profile';
import { getPublishedPosts } from '../lib/posts';
import { isExternal } from '../lib/posts-core';
import { withBase } from '../lib/url';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const site = context.site!;
  return rss({
    title: `${profile.name} — Writing`,
    description: 'Articles and notes on Android, Kotlin and Flutter.',
    site: new URL(withBase('/'), site).href,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: isExternal(p) ? p.data.externalUrl! : new URL(withBase(`/blog/${p.id}/`), site).href,
      categories: p.data.tags,
    })),
  });
}
