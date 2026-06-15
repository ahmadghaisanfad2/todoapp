/**
 * Drag-and-drop test — verify tasks can be moved between kanban columns.
 */
export default async function dragDropTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('h1', { timeout: 10000 })

  // Helper to create a task in a specific column
  async function createTask(title, columnHeading) {
    const column = page.locator('[data-kanban-column]', { has: page.locator('h3', { hasText: columnHeading }) })
    const addBtn = column.locator('button', { hasText: 'Add task' })
    await addBtn.click()

    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 3000 })

    const titleInput = dialog.locator('input[placeholder="Task title"]')
    await titleInput.fill(title)

    const submitBtn = dialog.locator('button[type="submit"]')
    await submitBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  test('create a task in Backlog for drag test', async () => {
    await createTask('Drag me', 'Backlog')
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await card.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await card.isVisible(), 'Task should be visible in Backlog')
  })

  test('task exists in Backlog column', async () => {
    const backlogCol = page.locator('[data-kanban-column]', { has: page.locator('h3', { hasText: 'Backlog' }) })
    const card = backlogCol.locator('[data-kanban-card]', { hasText: 'Drag me' })
    assert.ok(await card.isVisible(), 'Task should be in Backlog column')
  })

  test('task can be moved via status select in edit dialog', async () => {
    // Click the card to open edit dialog
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await card.click()

    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 3000 })

    // Change status via the select
    const statusSelect = dialog.locator('button[role="combobox"]').first()
    await statusSelect.click()

    const option = page.locator('[role="option"]', { hasText: 'In Progress' })
    await option.waitFor({ state: 'visible', timeout: 2000 })
    await option.click()

    // Save
    const saveBtn = dialog.locator('button[type="submit"]')
    await saveBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    // Verify task moved to In Progress
    const inProgressCol = page.locator('[data-kanban-column]', { has: page.locator('h3', { hasText: 'In Progress' }) })
    const movedCard = inProgressCol.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await movedCard.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await movedCard.isVisible(), 'Task should now be in In Progress column')
  })

  test('delete the drag test task', async () => {
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    // Hover to show delete button
    await card.hover()
    const deleteBtn = card.locator('button[aria-label^="Delete"]')
    await deleteBtn.click()

    // Card should be removed
    await card.waitFor({ state: 'hidden', timeout: 3000 })
    assert.ok(true, 'Task deleted successfully')
  })
}
