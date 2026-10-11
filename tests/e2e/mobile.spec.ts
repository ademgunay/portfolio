import { expect, test } from '@playwright/test';
import { gotoHome } from './helpers';

test('skills code block fits the phone viewport without horizontal scroll', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await gotoHome(page);
  const pre = page.locator('section[aria-labelledby="skills"] pre');
  await pre.scrollIntoViewIfNeeded();
  const { sw, cw } = await pre.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }));
  expect(sw).toBeLessThanOrEqual(cw + 1);
});
