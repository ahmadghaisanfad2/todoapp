/**
 * Kanban board regression tests — covers current board layout and status grouping.
 */
export default async function kanbanBoardTests({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')

  await page.evaluate(() => {
    localStorage.removeItem('wazheefa-tasks')
    localStorage.removeItem('wazheefa-settings')
    localStorage.removeItem('wazheefa-categories')
    localStorage.removeItem('wazheefa-kanban')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  async function createTask(title, priority) {
    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill(title)
    await dialog.locator('button', { hasText: priority }).click()
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  await createTask('Important meeting', 'High')
  await createTask('Casual reading', 'Low')

  test('default board columns are visible', async () => {
    for (const columnName of ['Backlog', 'To Do', 'In Progress', 'Done']) {
      const heading = page.getByRole('heading', { name: columnName })
      assert.ok(await heading.isVisible(), `${columnName} column should be visible`)
    }
  })

  test('new header tasks appear in To Do by default', async () => {
    const todoColumn = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'To Do' }),
    })

    assert.ok(await todoColumn.locator('text=Important meeting').isVisible(), 'High-priority task should appear in To Do')
    assert.ok(await todoColumn.locator('text=Casual reading').isVisible(), 'Low-priority task should appear in To Do')
  })

  test('priority badges render on task cards', async () => {
    const importantCard = page.locator('[data-kanban-card]', { hasText: 'Important meeting' })
    const casualCard = page.locator('[data-kanban-card]', { hasText: 'Casual reading' })

    assert.ok(await importantCard.locator('text=high').isVisible(), 'High priority badge should render')
    assert.ok(await casualCard.locator('text=low').isVisible(), 'Low priority badge should render')
  })

  test('status select moves a task between columns', async () => {
    await page.locator('text=Important meeting').click()
    const dialog = page.getByRole('dialog', { name: /Edit task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.getByRole('combobox').last().click()
    await page.getByRole('option', { name: 'In Progress' }).click()
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    const inProgressColumn = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'In Progress' }),
    })
    assert.ok(await inProgressColumn.locator('text=Important meeting').isVisible(), 'Task should move to In Progress')
  })

  test('column add buttons remain first after tasks exist', async () => {
    const todoColumn = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'To Do' }),
    })
    const firstActionLabel = await todoColumn.locator('[data-kanban-column-body] > *').first().getAttribute('aria-label')

    assert.equal(firstActionLabel, 'Tambah tugas di To Do', 'To Do add button should stay first after tasks exist')
  })
}
