import { expect, test } from '@playwright/test'

test.describe('Login page', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/login/')
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('login-email')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await expect(page.getByTestId('login-submit')).toBeVisible()
    await expect(page.getByTestId('login-google')).toBeVisible()
  })

  test('shows error with invalid credentials when Supabase is configured', async ({ page }) => {
    test.skip(
      !process.env.NEXT_PUBLIC_SUPABASE_URL,
      'Requires NEXT_PUBLIC_SUPABASE_URL for live auth test'
    )

    await page.goto('/login/')
    await page.getByTestId('login-email').fill('invalid@example.com')
    await page.getByTestId('login-password').fill('wrong-password')
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('login-error')).toBeVisible({ timeout: 10_000 })
  })
})
