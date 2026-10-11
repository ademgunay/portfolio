import type { Page } from '@playwright/test';

export const BASE = '/portfolio/';

export async function gotoHome(page: Page) {
  await page.goto(BASE);
}
