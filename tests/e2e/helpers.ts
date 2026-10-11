import { expect, type Page } from '@playwright/test';

import { BASE as SITE_BASE } from '../../site.config.mjs';

/** Base path with a trailing slash ('/' or '/portfolio/'). */
export const BASE = `${SITE_BASE.replace(/\/+$/, '')}/`;

export async function gotoHome(page: Page) {
  await page.goto(BASE);
}

/** Reach `selector` with real Tab presses, then assert it shows a visible focus ring. */
export async function tabTo(page: Page, selector: string, max = 120) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((s) => !!document.activeElement?.matches(s), selector)) {
      const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
      expect(outline).not.toBe('none');
      return;
    }
  }
  throw new Error(`Never reached ${selector} with Tab`);
}
