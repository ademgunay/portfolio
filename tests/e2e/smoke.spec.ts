import { expect, test } from '@playwright/test';
import { gotoHome } from './helpers';

test('home page loads under the /portfolio base', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Adem Gunay');
});
