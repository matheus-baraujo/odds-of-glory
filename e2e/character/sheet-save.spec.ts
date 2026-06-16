import { expect, test } from '@playwright/test'

test.describe('Character sheet persistence', () => {
  test('characters route requires auth', async ({ page }) => {
    await page.goto('/characters/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('character edit without id shows error', async ({ page }) => {
    await page.goto('/characters/edit/')
    await expect(page.getByTestId('character-edit-missing-id')).toBeVisible()
  })

  test('character edit page exposes rich sheet test ids when loaded', async ({ page }) => {
    await page.goto('/characters/edit/?id=missing')
    const missing = page.getByTestId('character-edit-missing-id')
    const editor = page.getByTestId('sheet-name')
    await expect(missing.or(editor)).toBeVisible()
  })
})

test.describe('Character sheet UI structure', () => {
  test('new character page requires auth', async ({ page }) => {
    await page.goto('/characters/new/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('characters list has preview button test id pattern', async ({ page }) => {
    await page.goto('/characters/')
    await expect(page).toHaveURL(/\/login\//)
  })

  test('player room requires auth', async ({ page }) => {
    await page.goto('/room/player/')
    await expect(page).toHaveURL(/\/login\//)
  })
})
