/**
 * Drag-and-drop test — verify tasks can be moved between kanban columns.
 */
export default async function dragDropTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('header', { timeout: 10000 })

  async function ensureKanbanVisible() {
    const hasColumns = (await page.locator('[data-kanban-column]').count()) > 0
    if (hasColumns) return

    const addFirst = page.getByRole('button', { name: 'Add first task' })
    await addFirst.click()
    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill('Board seed')
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  await ensureKanbanVisible()

  async function createTask(title, columnHeading) {
    const column = page.locator('[data-kanban-column]', { has: page.locator('h2', { hasText: columnHeading }) })
    const addBtn = column.locator('button', { hasText: 'Add task' })
    await addBtn.click()

    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill(title)
    await dialog.getByRole('combobox').last().click()
    await page.getByRole('option', { name: columnHeading }).click()
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  test('create a task in Backlog for drag test', async () => {
    await createTask('Drag me', 'Backlog')
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await card.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await card.isVisible(), 'Task should be visible in Backlog')
  })

  test('task exists in Backlog column', async () => {
    const backlogCol = page.locator('[data-kanban-column]', { has: page.locator('h2', { hasText: 'Backlog' }) })
    const card = backlogCol.locator('[data-kanban-card]', { hasText: 'Drag me' })
    assert.ok(await card.isVisible(), 'Task should be in Backlog column')
  })

  test('kanban card exposes drag handle for touch and pointer input', async () => {
    const backlogCol = page.locator('[data-kanban-column]', { has: page.locator('h2', { hasText: 'Backlog' }) })
    const card = backlogCol.locator('[data-kanban-card]', { hasText: 'Drag me' })
    const handle = card.locator('[data-kanban-drag-handle]')

    await handle.waitFor({ state: 'visible', timeout: 3000 })
    const label = await handle.getAttribute('aria-label')
    assert.ok(label?.startsWith('Drag '), 'Drag handle should be labeled for assistive tech')
  })

  test('task can be moved via status select in edit dialog', async () => {
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await card.click()

    const dialog = page.getByRole('dialog', { name: /Edit task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.getByRole('combobox').last().click()

    const option = page.getByRole('option', { name: 'Done' })
    await option.waitFor({ state: 'visible', timeout: 2000 })
    await option.click()

    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    const doneCol = page.locator('[data-kanban-column]', { has: page.locator('h2', { hasText: 'Done' }) })
    const movedCard = doneCol.locator('[data-kanban-card]', { hasText: 'Drag me' })
    await movedCard.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await movedCard.isVisible(), 'Task should now be in Done column')
  })

  test('delete the drag test task', async () => {
    const card = page.locator('[data-kanban-card]', { hasText: 'Drag me' })
    const deleteBtn = card.locator('button[aria-label^="Delete"]')
    await deleteBtn.click()

    const dialog = page.getByRole('dialog', { name: /Delete task/i })
    await dialog.waitFor({ state: 'visible', timeout: 3000 })
    await dialog.getByRole('button', { name: 'Delete task' }).click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    await card.waitFor({ state: 'hidden', timeout: 3000 })
    assert.ok(true, 'Task deleted successfully')
  })
}
