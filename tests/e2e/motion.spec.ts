import { expect, test } from '@playwright/test';
import { BASE, gotoHome, tabTo } from './helpers';

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
  await tabTo(page, '[data-rail-index="3"]');
  await expect(rail).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-showcase-list] > li[data-index="3"] h3')).toBeInViewport();
  await expect(page.locator('[data-rail-index="3"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-stage-phone="3"]')).toHaveCSS('opacity', '1');
});

test('stage phone stays clear of the nav on a 1366x657 laptop', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.setViewportSize({ width: 1366, height: 657 });
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await page.evaluate(() => {
    const body = document.querySelector('[data-showcase-body]')!.getBoundingClientRect();
    scrollTo(0, scrollY + body.top + body.height / 2 - innerHeight / 2);
  });
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--in-view/);
  await page.waitForTimeout(600);
  const box = await page.locator('[data-stage-phone] [data-phone]').evaluateAll((els) => {
    const visible = els.map((e) => e.closest('[data-stage-phone]') as HTMLElement).find((p) => p.style.opacity === '1');
    const r = visible!.querySelector('[data-phone]')!.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, vh: innerHeight };
  });
  expect(box.top).toBeGreaterThanOrEqual(64);
  expect(box.bottom).toBeLessThanOrEqual(box.vh);
});

test('rail is hidden from focus until the showcase is in view', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await expect(page.locator('[data-showcase-rail]')).toHaveCSS('visibility', 'hidden');
});

test('page content is pre-hidden before motion runs (no paint-then-vanish flash)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.route('**/*.js', (r) => r.abort());
  await page.goto(BASE);
  await expect(page.locator('html')).toHaveClass(/motion-ready/);
  await expect(page.locator('[data-reveal]').first()).toHaveCSS('opacity', '0');
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/, { timeout: 5000 }); // 3s safety net
  await expect(page.locator('[data-reveal]').first()).toHaveCSS('opacity', '1');
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
  expect(cls).toBeLessThanOrEqual(0.1);
});

test('enhanced: every stage phone screenshot loads', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await page.evaluate(() => document.querySelector('[data-showcase-list] > li')!.scrollIntoView({ block: 'center' }));
  const imgs = await page.locator('[data-stage-phone] img').all();
  expect(imgs.length).toBeGreaterThan(0);
  for (const img of imgs) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test('rail does not overlap app text at 1040x800', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await page.setViewportSize({ width: 1040, height: 800 });
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await page.evaluate(() => document.querySelector('[data-showcase-list] > li')!.scrollIntoView({ block: 'center' }));
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--in-view/);
  await expect(page.locator('[data-showcase-rail]')).toHaveCSS('opacity', '1');
  await page.waitForTimeout(400);
  const overlaps = await page.evaluate(() => {
    const r = document.querySelector('[data-showcase-rail] ul')!.getBoundingClientRect();
    const hits: string[] = [];
    document.querySelectorAll('.app-text').forEach((t) => {
      // measure the widest text child boxes, only those on screen
      t.querySelectorAll<HTMLElement>('h3, p, div, ul, a').forEach((c) => {
        const b = c.getBoundingClientRect();
        if (b.width === 0 || b.height === 0 || b.bottom < 0 || b.top > innerHeight) return;
        if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) hits.push(c.tagName + ':' + Math.round(b.right));
      });
    });
    return hits;
  });
  expect(overlaps).toEqual([]);
});

test('rail jump does not flicker through intermediate apps', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await page.evaluate(() => document.querySelector('[data-showcase-list] > li')!.scrollIntoView({ block: 'center' }));
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--in-view/);
  await expect(page.locator('[data-stage-phone="0"]')).toHaveCSS('opacity', '1');
  await page.evaluate(() => {
    const seen = new Set<number>([0]);
    (window as any).__seen = seen;
    document.querySelectorAll<HTMLElement>('[data-stage-phone]').forEach((el) => {
      const i = Number(el.dataset.stagePhone);
      new MutationObserver(() => { if (el.style.opacity === '1') seen.add(i); }).observe(el, { attributes: true, attributeFilter: ['style'] });
    });
  });
  await page.locator('[data-rail-index="5"]').click();
  await expect(page.locator('[data-stage-phone="5"]')).toHaveCSS('opacity', '1');
  await page.waitForTimeout(1500);
  const seen = await page.evaluate(() => [...(window as any).__seen].sort());
  expect(seen).toEqual([0, 5]);
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
    await expect(page.locator('[data-typing]')).toBeVisible();
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
