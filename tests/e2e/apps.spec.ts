import { expect, test } from '@playwright/test';
import { gotoHome } from './helpers';

const NAMES = ['WYZauto', 'Pi Financial', 'SCG MyHome', '7-Eleven', 'Rama 9 Hospital', 'SOS Thailand'];

test('renders exactly six apps in order with role and stack', async ({ page }) => {
  await gotoHome(page);
  const items = page.locator('[data-showcase-list] > li');
  await expect(items).toHaveCount(6);
  for (const [i, name] of NAMES.entries()) {
    const item = items.nth(i);
    await expect(item.getByRole('heading', { level: 3 })).toHaveText(name);
    await expect(item.locator('[data-stack] li').first()).toBeVisible();
    await expect(item.getByText(`0${i + 1} / 06`)).toBeAttached();
  }
});

test('store badges open in a new tab; non-live apps show a note instead', async ({ page }) => {
  await gotoHome(page);
  const items = page.locator('[data-showcase-list] > li');
  for (let i = 0; i < 6; i++) {
    const item = items.nth(i);
    const status = await item.getAttribute('data-status');
    const badges = item.locator('[data-store-badge]');
    if (status === 'live') {
      expect(await badges.count()).toBeGreaterThan(0);
      for (const b of await badges.all()) {
        await expect(b).toHaveAttribute('target', '_blank');
        await expect(b).toHaveAttribute('rel', /noopener/);
      }
      await expect(item.locator('[data-status-note]')).toHaveCount(0);
    } else {
      await expect(badges).toHaveCount(0);
      await expect(item.locator('[data-store-row]')).toHaveCount(0);
      await expect(item.locator('[data-status-note]')).toBeVisible();
    }
  }
});

test.describe('stacked cards (enhancement off; card phones are display:none when enhanced)', () => {
  test.use({ reducedMotion: 'reduce' });
  test('every app screenshot has loaded with real dimensions', async ({ page }) => {
    await gotoHome(page);
    const imgs = await page.locator('[data-card-phone] img').all();
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
  });
});
