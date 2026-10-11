import { getCollection, type CollectionEntry } from 'astro:content';
import { filterPublished, isExternal } from './posts-core';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  return filterPublished(await getCollection('blog'));
}

export async function getLocalPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getPublishedPosts()).filter((p) => !isExternal(p));
}
