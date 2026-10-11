const ABSOLUTE = /^[a-z][a-z\d+.-]*:/i;

export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  if (ABSOLUTE.test(path)) return path;
  const b = base.endsWith('/') ? base : `${base}/`;
  const p = path.replace(/^\/+/, '');
  return `${b}${p}`;
}
