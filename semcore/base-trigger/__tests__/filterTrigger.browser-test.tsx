import { expect, test } from '@semcore/testing-utils/playwright';
import { e2eStandToHtml } from '@semcore/testing-utils/e2e-stand';
import { selectOption } from './utils';

test.describe('BaseTrigger', () => {
  test('FilterTrigger Focus control', async ({ page, browserName }) => {
    const standPath = 'website/docs/components/filter-trigger/examples/usage_with_select.tsx';
    const htmlContent = await e2eStandToHtml(standPath, 'en');

    await page.setContent(htmlContent);

    await selectOption(page);
    const popperLocator = await page.locator('[data-ui-name="Select.Menu"]');
    await expect(popperLocator).toHaveCount(0);

    const triggerLocator = await page.locator(
      '[data-ui-name="Select.Trigger"] [data-ui-name="FilterTrigger.TriggerButton"]',
    );

    await expect(triggerLocator).toBeFocused();

    await expect(page).toHaveScreenshot();

    await page.keyboard.press('Tab');

    const clearButtonLocator = await page.locator(
      'button[data-ui-name="FilterTrigger.ClearButton"]',
    );

    await expect(clearButtonLocator).toBeFocused();
    await expect(page).toHaveScreenshot();

    await page.keyboard.press('Enter');

    await page.waitForSelector('text=Select option');

    await expect(triggerLocator).toBeFocused();

    await expect(page).toHaveScreenshot();
  });
});
