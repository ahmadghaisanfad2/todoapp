/**
 * Smoke test — verify core app shell renders correctly.
 */
export default async function smokeTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('h1', { timeout: 10000 })

  test('header shows Wazheefa title', async () => {
    const title = page.locator('h1', { hasText: 'Wazheefa' })
    await title.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await title.isVisible(), 'Wazheefa title should be visible')
  })

  test('Kanban board columns are visible', async () => {
    const todo = page.getByRole('heading', { name: 'To Do' })
    await todo.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await todo.isVisible(), 'To Do column should be visible')
  })

  test('FAB (Add task) button is visible', async () => {
    const fab = page.getByRole('button', { name: 'Add task' })
    await fab.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await fab.isVisible(), 'FAB should be visible')
  })

  test('clicking FAB opens task dialog', async () => {
    const fab = page.getByRole('button', { name: 'Add task' })
    await fab.click()
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await dialog.isVisible(), 'Task dialog should open after FAB click')

    // Close dialog
    const cancelBtn = dialog.locator('button', { hasText: 'Cancel' })
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click()
    } else {
      await page.keyboard.press('Escape')
    }
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  test('category button is visible', async () => {
    const catBtn = page.locator('button[aria-label="Manage categories"]')
    assert.ok(await catBtn.isVisible(), 'Category button should be visible')
  })

  test('theme toggle button is visible', async () => {
    const themeBtn = page.locator('button[aria-label^="Switch theme"]')
    assert.ok(await themeBtn.isVisible(), 'Theme toggle should be visible')
  })
}
