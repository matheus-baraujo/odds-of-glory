import { expect, test } from '@playwright/test'

test.describe('Admin access', () => {
  test('non-admin users see access denied when authenticated', async ({ page }) => {
    test.skip(true, 'Requires authenticated storageState fixture — enable after auth test setup')

    const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
    await page.goto(`/${adminPath}/`)
    await expect(page.getByTestId('admin-denied')).toBeVisible()
  })

  test('admin route is not linked from public home', async ({ page }) => {
    await page.goto('/')
    const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
    await expect(page.getByRole('link', { name: adminPath })).toHaveCount(0)
  })
})
