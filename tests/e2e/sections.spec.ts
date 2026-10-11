import { expect, test } from '@playwright/test';
import { gotoHome } from './helpers';

test('experience shows companies in order and nested promotions', async ({ page }) => {
  await gotoHome(page);
  const companies = page.locator('section[aria-labelledby="experience"] [data-company]');
  await expect(companies).toHaveText(['WYZauto', 'Pi Securities', 'OOZOU', 'Appsynth', 'Freelance', 'Tricount']);
  const oozou = page.locator('[data-job="OOZOU"]');
  await expect(oozou.locator('[data-role]')).toHaveText([/Android Team Lead/, /Android Developer/]);
});

test('skills render as selectable text in a code block', async ({ page }) => {
  await gotoHome(page);
  const code = page.locator('section[aria-labelledby="skills"] pre');
  await expect(code).toContainText('object Skills');
  await expect(code).toContainText('"Kotlin"');
  await expect(code).toContainText('"BLoC/Cubit"');
});

test('about tells the path and lists languages', async ({ page }) => {
  await gotoHome(page);
  const about = page.locator('section[aria-labelledby="about"]');
  await expect(about).toContainText('CNC machine operator');
  for (const l of ['English', 'French', 'Turkish', 'Dutch']) await expect(about).toContainText(l);
});

test('copy email writes address to clipboard and announces it', async ({ page }) => {
  await gotoHome(page);
  const btn = page.locator('[data-copy-email]');
  await btn.focus();
  await expect(btn).toBeFocused();
  await btn.click();
  await expect(page.locator('[data-copy-toast]')).toHaveText('Email copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('gunayadem.dev@gmail.com');
});

test('contact links point to profiles', async ({ page }) => {
  await gotoHome(page);
  const c = page.locator('section[aria-labelledby="contact"]');
  await expect(c.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/adem-gunay');
  await expect(c.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/ademgunay');
  await expect(c.getByRole('link', { name: /Medium/ })).toHaveAttribute('href', 'https://medium.com/@gunayadem.dev');
});
