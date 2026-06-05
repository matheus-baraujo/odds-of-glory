import { expect, test } from '@playwright/test'

test.describe('Lobby roles', () => {
  test('lobby page requires authentication', async ({ page }) => {
    await page.goto('/lobby/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('register page is reachable without auth', async ({ page }) => {
    await page.goto('/register/')
    await expect(page.getByTestId('register-form')).toBeVisible()
  })
})
