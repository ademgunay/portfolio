import type { Page } from '@playwright/test';

import { BASE as SITE_BASE } from '../../site.config.mjs';

/** Base path with a trailing slash ('/' or '/portfolio/'). */
export const BASE = `${SITE_BASE.replace(/\/+$/, '')}/`;

export async function gotoHome(page: Page) {
  await page.goto(BASE);
}
