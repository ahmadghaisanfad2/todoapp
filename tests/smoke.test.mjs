/**
 * Smoke test — verify core app shell renders correctly.
 */
export default async function smokeTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('header', { timeout: 10000 })

  test('app shell shows navigation chrome', async () => {
    const backBtn = page.getByRole('button', { name: /Back to home/i })
    await backBtn.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await backBtn.isVisible(), 'Back to home control should be visible in app shell')
  })

  test('empty board shows focus session invitation or kanban columns', async () => {
    const emptyHeading = page.getByText('Ready for a focus session?')
    const todoColumn = page.getByRole('heading', { name: 'To Do' })

    const emptyVisible = await emptyHeading.isVisible().catch(() => false)
    if (emptyVisible) {
      assert.ok(await emptyHeading.isVisible(), 'Empty board should invite a focus session')
      const addFirst = page.getByRole('button', { name: 'Add first task' })
      assert.ok(await addFirst.isVisible(), 'Add first task CTA should be visible on empty board')
      return
    }

    await todoColumn.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await todoColumn.isVisible(), 'To Do column should be visible when tasks exist')
  })

  test('FAB (Add task) button is visible', async () => {
    const addTaskBtn = page.getByRole('button', { name: 'Add task', exact: true })
    await addTaskBtn.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await addTaskBtn.isVisible(), 'Add task button should be visible in header')
  })

  test('clicking Add task opens task dialog', async () => {
    const addTaskBtn = page.getByRole('button', { name: 'Add task', exact: true })
    await addTaskBtn.click()
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
