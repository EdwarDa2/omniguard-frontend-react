import { expect, test } from '@playwright/test'

test('login happy path and invalid credentials', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('analista').fill('wrong-user')
  await page.getByPlaceholder('••••••••••••').fill('wrong-password')
  await page.getByRole('button', { name: 'Ingresar a la Consola' }).click()
  await expect(page.getByText(/credenciales/i)).toBeVisible()

  await page.getByPlaceholder('analista').fill('admin')
  await page.getByPlaceholder('••••••••••••').fill('OmniGuardAdmin2026!')
  await page.getByRole('button', { name: 'Ingresar a la Consola' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('Open Ports')).toBeVisible()
  await expect(page.getByText('Active Threats')).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/\/dashboard/)
  await page.getByRole('button', { name: 'Cerrar sesión segura' }).click()
  await expect(page).toHaveURL(/\/login/)
})
