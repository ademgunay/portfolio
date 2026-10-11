export type PostLike = { id: string; data: { date: Date; draft?: boolean; externalUrl?: string } };

export function isExternal(p: PostLike): boolean {
  return Boolean(p.data.externalUrl);
}

export function filterPublished<T extends PostLike>(posts: T[]): T[] {
  return posts
    .filter((p) => p.data.draft !== true)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
