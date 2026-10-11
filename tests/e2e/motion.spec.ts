import { expect, test } from '@playwright/test';
import { BASE, gotoHome } from './helpers';

const isMobile = (name: string) => name === 'mobile';

test('desktop with motion: showcase is enhanced, rail navigates, stage phone follows', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  const showcase = page.locator('[data-showcase]');
  await expect(showcase).toHaveClass(/showcase--enhanced/);
  await page.evaluate(() => document.querySelector('[data-showcase-list] > li')!.scrollIntoView({ block: 'center' }));
  await expect(showcase).toHaveClass(/showcase--in-view/);
  await expect(page.locator('[data-showcase-rail]')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-showcase-stage]')).toBeVisible();
  await expect(page.locator('[data-card-phone]').first()).toBeHidden();
  const rail = page.locator('[data-rail-index="3"]');
  await rail.focus();
  await expect(rail).toBeFocused();
  await rail.click();
  await expect(page.locator('[data-showcase-list] > li[data-index="3"] h3')).toBeInViewport();
  await expect(page.locator('[data-rail-index="3"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-stage-phone="3"]')).toHaveCSS('opacity', '1');
});

test('desktop resized below 1024px reverts to stacked cards (Review Focus #2)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await page.setViewportSize({ width: 800, height: 900 });
  await expect(page.locator('[data-showcase]')).not.toHaveClass(/showcase--enhanced/);
  await expect(page.locator('[data-showcase-stage]')).toBeHidden();
  for (const phone of await page.locator('[data-card-phone]').all()) {
    await phone.scrollIntoViewIfNeeded();
    await expect(phone).toBeVisible();
  }
});

test('nav anchor lands section heading in viewport with Lenis active (Review Focus #3)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience', exact: true }).click();
  const h = page.locator('#experience');
  await expect(h).toBeInViewport();
  const box = await h.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(64); // not hidden under 64px sticky nav
});

test('scrolling through the showcase causes no layout shift', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.addInitScript(() => {
    (window as any).__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await gotoHome(page);
  await page.waitForLoadState('load');
  const end = await page.evaluate(() => document.querySelector('[data-showcase]')!.getBoundingClientRect().bottom + scrollY);
  for (let y = 0; y < end; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(500);
  const cls = await page.evaluate(() => (window as any).__cls);
  console.log(`MEASURED_CLS=${cls} scrolled_to=${end}`);
  expect(cls).toBeLessThanOrEqual(0.1);
});

test('mobile: stacked cards, no enhancement', async ({ page }, info) => {
  test.skip(!isMobile(info.project.name));
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).not.toHaveClass(/showcase--enhanced/);
  await expect(page.locator('[data-showcase-stage]')).toBeHidden();
  await page.locator('[data-card-phone]').first().scrollIntoViewIfNeeded();
  await expect(page.locator('[data-card-phone]').first()).toBeVisible();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no enhancement and all reveal content visible without scrolling animations', async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('html')).not.toHaveClass(/motion-ready/);
    await expect(page.locator('[data-showcase]')).not.toHaveClass(/showcase--enhanced/);
    for (const el of await page.locator('[data-reveal]').all()) {
      await expect(el).toHaveCSS('opacity', '1');
    }
    await expect(page.locator('[data-typing]')).toHaveText('whoami');
  });
});

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  test('every section and app is visible', async ({ page }) => {
    await page.goto(BASE);
    for (const id of ['apps', 'experience', 'skills', 'about', 'writing', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator('[data-showcase-list] > li')).toHaveCount(6);
    for (const el of await page.locator('[data-reveal]').all()) {
      await expect(el).toHaveCSS('opacity', '1');
    }
  });
});
