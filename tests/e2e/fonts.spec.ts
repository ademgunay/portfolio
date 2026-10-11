import { expect, test } from '@playwright/test';
import { homePath } from './helpers';

for (const lang of ['en', 'fr'] as const) {
  test(`late web-font swap does not shift layout (${lang})`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    // Force the fallback -> web font swap to happen late, after first paint.
    await page.route('**/*.woff2', async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
    await page.goto(homePath(lang));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(() => (window as any).__cls);
    expect(cls).toBeLessThanOrEqual(0.05);
  });
}

test('above-the-fold fonts are preloaded with crossorigin and resolve', async ({ page, request }) => {
  await page.goto(homePath('fr'));
  const links = await page.$$eval('link[rel="preload"][as="font"]', (els) =>
    els.map((e) => ({ href: (e as HTMLLinkElement).href, type: e.getAttribute('type'), cross: e.hasAttribute('crossorigin') })),
  );
  expect(links.length).toBeGreaterThanOrEqual(2);
  for (const l of links) {
    expect(l.type).toBe('font/woff2');
    expect(l.cross).toBe(true);
    expect((await request.get(l.href)).status()).toBe(200);
  }
});
