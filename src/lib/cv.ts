import { profile } from '../content/profile';
import { withBase } from './url';
import type { Lang } from '../i18n/ui';

/** Base-prefixed CV URL for a language, falling back to the default `cvPath`. */
export const cvHref = (lang: Lang): string => withBase(profile.cvPaths?.[lang] ?? profile.cvPath);
