import { expect, test, type Page } from '@playwright/test';
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
  await page.waitForTimeout(800); // let the focus-induced scroll settle before activating
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

// --- snap scrolling between apps (desktop only) ---
const snapY = (page: Page, i: number) =>
  page.evaluate((n) => Math.ceil(document.querySelectorAll('[data-showcase-list] > li')[n].getBoundingClientRect().top + scrollY), i);
const scrollNow = (page: Page, y: number) => page.evaluate((v) => scrollTo(0, v), y);
const settle = async (page: Page, ms = 1000) => {
  let last = -1;
  let since = Date.now();
  await expect.poll(async () => {
    const y = await page.evaluate(() => scrollY);
    if (Math.abs(y - last) > 0.5) { last = y; since = Date.now(); }
    return Date.now() - since >= ms;
  }, { timeout: 8000, intervals: [100] }).toBe(true);
  return last;
};

test.describe('showcase snap scrolling', () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(isMobile(info.project.name));
    await gotoHome(page);
    await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
    await page.mouse.move(700, 450);
  });

  test('released within 30% of an app, it eases to that app', async ({ page }) => {
    await page.waitForLoadState('load');
    const s1 = await snapY(page, 1);
    const vh = 900;
    await scrollNow(page, s1 - 0.15 * vh - 80);
    await settle(page, 300);
    await page.mouse.wheel(0, 80);
    await expect.poll(async () => Math.abs((await snapY(page, 1)) - (await page.evaluate(() => scrollY))), { timeout: 5000 }).toBeLessThanOrEqual(2);
    const y = await settle(page, 500);
    expect(Math.abs(y - (await snapY(page, 1)))).toBeLessThanOrEqual(2);
  });

  test('decision uses the real position: a final 100px wheel step ending 240px past an app snaps back', async ({ page }) => {
    await page.waitForLoadState('load');
    const s2 = await snapY(page, 2);
    await scrollNow(page, s2 + 140);
    await settle(page, 300);
    await page.mouse.wheel(0, 100); // lands ~240px past the app: inside 30% of 900, but 340px if the delta were counted twice
    await expect.poll(async () => Math.abs((await snapY(page, 2)) - (await page.evaluate(() => scrollY))), { timeout: 5000 }).toBeLessThanOrEqual(2);
  });

  test('released between two apps (beyond 30% of both), it stays put', async ({ page }) => {
    const s1 = await snapY(page, 1);
    const s2 = await snapY(page, 2);
    const mid = (s1 + s2) / 2;
    await scrollNow(page, mid - 80);
    await settle(page, 300);
    await page.mouse.wheel(0, 80);
    const y0 = await settle(page, 400);
    await page.waitForTimeout(1000);
    const y1 = await page.evaluate(() => scrollY);
    expect(Math.abs(y1 - y0)).toBeLessThanOrEqual(5);
    expect(Math.abs(y1 - mid)).toBeLessThanOrEqual(20);
  });

  test('scrolling past the last app into Experience is not pulled back', async ({ page }) => {
    const last = await snapY(page, 5);
    await scrollNow(page, last + 200);
    await settle(page, 300);
    const dist = await page.evaluate(() => document.querySelector('#experience')!.getBoundingClientRect().top - 300);
    for (let sent = 0; sent < dist; sent += 200) { // fixed total input: Lenis lags the wheel, so don't read scrollY mid-flight
      await page.mouse.wheel(0, Math.min(200, dist - sent));
      await page.waitForTimeout(40);
    }
    const y = await settle(page, 700);
    expect(y).toBeGreaterThan(last + 900 * 0.6);
    await expect(page.locator('#experience')).toBeInViewport();
  });
});

test('no snapping on mobile', async ({ page }, info) => {
  test.skip(!isMobile(info.project.name));
  await gotoHome(page);
  const apps = await page.evaluate(() => document.querySelector('#apps')!.getBoundingClientRect().top + scrollY);
  await scrollNow(page, apps + 400);
  await settle(page, 300);
  await page.mouse.wheel(0, 60);
  const y0 = await settle(page, 400);
  await page.waitForTimeout(1000);
  expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThanOrEqual(1);
});

test.describe('reduced motion snap', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no snapping', async ({ page }, info) => {
    test.skip(isMobile(info.project.name));
    await gotoHome(page);
    await page.mouse.move(700, 450);
    const s1 = await page.evaluate(() => document.querySelectorAll('[data-showcase-list] > li')[1].getBoundingClientRect().top + scrollY);
    await scrollNow(page, s1 - 200);
    await settle(page, 300);
    await page.mouse.wheel(0, 60);
    const y0 = await settle(page, 400);
    await page.waitForTimeout(1000);
    expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThanOrEqual(1);
  });
});

test('page stops moving when wheel input stops (no smoothing lag)', async ({ page }, info) => {
  test.skip(isMobile(info.project.name));
  await gotoHome(page);
  await expect(page.locator('[data-showcase]')).toHaveClass(/showcase--enhanced/);
  await page.mouse.move(700, 450);
  const exp = await page.evaluate(() => document.querySelector('#experience')!.getBoundingClientRect().top + scrollY);
  await scrollNow(page, exp - 1500);
  await settle(page, 300);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(50);
  const early = await page.evaluate(() => scrollY);
  await page.waitForTimeout(500);
  const late = await page.evaluate(() => scrollY);
  expect(late - early).toBeLessThanOrEqual(5);
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
