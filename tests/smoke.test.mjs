/**
 * Smoke test — verify core app shell renders correctly.
 */
export default async function smokeTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')

  test('header shows TodoFlow title', async () => {
    const title = page.locator('h1', { hasText: 'TodoFlow' })
    await title.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await title.isVisible(), 'TodoFlow title should be visible')
  })

  test('search input is visible', async () => {
    const search = page.locator('input[placeholder="Search tasks..."]')
    await search.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await search.isVisible(), 'Search input should be visible')
  })

  test('FAB (Add task) button is visible', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await fab.isVisible(), 'FAB should be visible')
  })

  test('clicking FAB opens task dialog', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
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
