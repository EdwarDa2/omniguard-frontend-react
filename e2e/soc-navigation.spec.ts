import { expect, test } from '@playwright/test'

test('dashboard loads after login and exposes alerts and assets', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('analista').fill('admin')
  await page.getByPlaceholder('••••••••••••').fill('OmniGuardAdmin2026!')
  await page.getByRole('button', { name: 'Ingresar a la Consola' }).click()

  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('Open Ports')).toBeVisible()

  await page.getByRole('link', { name: 'Alerts' }).click()
  await expect(page).toHaveURL(/\/alerts/)
  await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible()

  await page.getByRole('link', { name: 'Assets' }).click()
  await expect(page).toHaveURL(/\/assets/)
  await expect(page.getByRole('heading', { name: 'Assets' })).toBeVisible()
})
