import { expect, test } from '@playwright/test';
import { BASE, gotoHome } from './helpers';

test('home Writing strip shows 3 latest entries, external marked', async ({ page }) => {
  await gotoHome(page);
  const items = page.locator('section[aria-labelledby="writing"] [data-post]');
  await expect(items).toHaveCount(3);
  await expect(items.first()).toContainText('A personal top of Flutter packages');
  const link = items.first().getByRole('link');
  await expect(link).toHaveAttribute('href', /^https:\/\/medium\.com\//);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  await expect(items.nth(1)).toContainText('Better Programming');
  await expect(page.getByRole('link', { name: /All writing/ })).toHaveAttribute('href', `${BASE}blog/`);
});

test('/blog lists all 5 published entries and no draft', async ({ page }) => {
  await page.goto(`${BASE}blog/`);
  await expect(page.locator('[data-post]')).toHaveCount(5);
  await expect(page.getByText('Example post (template)')).toHaveCount(0);
});

test('draft example has no page', async ({ page }) => {
  const res = await page.goto(`${BASE}blog/example-draft/`);
  expect(res?.status()).toBe(404);
});

test('nav links on /blog return to home sections (Review Focus #1)', async ({ page }) => {
  await page.goto(`${BASE}blog/`);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Apps', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${BASE}#apps$`));
  await expect(page.locator('#apps')).toBeInViewport();
});

test('rss feed lists external entries with their Medium URLs', async ({ request }) => {
  const res = await request.get(`${BASE}rss.xml`);
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  expect((xml.match(/<item>/g) ?? []).length).toBe(5);
  expect(xml).toContain('https://medium.com/better-programming/');
  expect(xml).not.toContain('example-draft');
});
