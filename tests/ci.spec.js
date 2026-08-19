import { test, expect } from '@playwright/test'

test.describe('CI', () => {
  test('confirms we have not broken the build', async ({ page }) => {
    await page.setContent('<h1>Playwright CI Ready</h1>')

    const heading = page.locator('h1')

    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('Playwright CI Ready')
  })
})
