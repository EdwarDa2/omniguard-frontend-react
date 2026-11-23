import { expect, test } from '@playwright/test'

test('settings notifications tab loads and rejects invalid webhook', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('analista').fill('admin')
  await page.getByPlaceholder('••••••••••••').fill('OmniGuardAdmin2026!')
  await page.getByRole('button', { name: 'Ingresar a la Consola' }).click()
  await expect(page).toHaveURL(/\/dashboard/)

  await page.goto('/settings')
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await page.getByRole('button', { name: 'Notificaciones' }).click()

  const webhookInput = page.getByPlaceholder('https://discord.com/api/webhooks/...')
  await webhookInput.fill('http://127.0.0.1/internal')
  const saveResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/v1/settings/notifications/discord') &&
      response.request().method() === 'PUT',
  )
  await page.getByRole('button', { name: 'Guardar webhook' }).click()
  const response = await saveResponse
  expect(response.status()).toBe(400)
})
