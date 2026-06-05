import { expect, test } from '@playwright/test'

test.describe('Protected routes', () => {
  test('lobby redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/lobby/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('characters redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/characters/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('admin path redirects unauthenticated users to login', async ({ page }) => {
    const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
    await page.goto(`/${adminPath}/`)
    await expect(page).toHaveURL(/\/login\//)
  })
})
