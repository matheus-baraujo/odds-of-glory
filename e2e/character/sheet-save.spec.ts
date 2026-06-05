import { expect, test } from '@playwright/test'

test.describe('Character sheet persistence', () => {
  test('characters route requires auth', async ({ page }) => {
    await page.goto('/characters/')
    await expect(page).toHaveURL(/\/login\//)
  })
})
