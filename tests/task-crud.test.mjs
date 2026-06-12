/**
 * Task CRUD regression tests — covers create, edit, move, delete, and Kanban add-button placement.
 */
export default async function taskCrudTests({ page, test, assert, BASE_URL }) {
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

  async function addTaskFromHeader(title, priority = 'Low') {
    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill(title)
    await dialog.locator('button', { hasText: priority }).click()
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  async function addTaskFromColumn(columnName, title) {
    const column = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: columnName }),
    })
    await column.getByRole('button', { name: `Tambah tugas di ${columnName}` }).click()

    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill(title)
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  test('empty Kanban columns render add buttons before task cards', async () => {
    const columns = page.locator('[data-kanban-column]')
    assert.equal(await columns.count(), 4, 'Default Kanban should render four columns')

    for (const columnName of ['Backlog', 'To Do', 'In Progress', 'Done']) {
      const column = columns.filter({ has: page.getByRole('heading', { name: columnName }) })
      const firstActionLabel = await column.locator('[data-kanban-column-body] > *').first().getAttribute('aria-label')
      assert.equal(firstActionLabel, `Tambah tugas di ${columnName}`, `${columnName} add button should be first in the column body`)
    }
  })

  test('can create a task from the header add button', async () => {
    await addTaskFromHeader('Buy groceries', 'High')

    const task = page.locator('text=Buy groceries')
    assert.ok(await task.isVisible(), 'Created task should appear in the board')
  })

  test('can create a task in a specific column from the first column action', async () => {
    await addTaskFromColumn('Backlog', 'Plan sprint')

    const backlogColumn = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'Backlog' }),
    })
    assert.ok(await backlogColumn.locator('text=Plan sprint').isVisible(), 'Column add should create the task in Backlog')
  })

  test('task dialog is wider than baseline', async () => {
    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const box = await dialog.boundingBox()
    assert.ok(box, 'Dialog should have a bounding box')
    assert.ok(box.width >= 400, `Dialog width (${box.width}) should be >= 400px`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  test('can edit a task by clicking its card', async () => {
    await page.locator('text=Plan sprint').click()

    const dialog = page.getByRole('dialog', { name: /Edit task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.locator('#task-title').fill('Plan release')
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    assert.ok(await page.locator('text=Plan release').isVisible(), 'Edited task should show new title')
  })

  test('can move a task to Done from the edit dialog', async () => {
    await page.locator('text=Plan release').click()

    const dialog = page.getByRole('dialog', { name: /Edit task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await dialog.getByRole('combobox').last().click()
    await page.getByRole('option', { name: 'Done' }).click()
    await dialog.locator('button[type="submit"]').click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    const doneColumn = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'Done' }),
    })
    assert.ok(await doneColumn.locator('text=Plan release').isVisible(), 'Task should move to Done')
  })

  test('can delete a task from the card action', async () => {
    const card = page.locator('[data-kanban-card]').filter({ hasText: 'Plan release' })
    await card.getByRole('button', { name: 'Delete Plan release' }).click()

    await page.waitForTimeout(300)
    assert.equal(await page.locator('text=Plan release').count(), 0, 'Deleted task should no longer appear')
  })

  test('priority buttons have large touch targets', async () => {
    await page.getByRole('button', { name: 'Add task' }).click()
    const dialog = page.getByRole('dialog', { name: /Add task/i })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const highBtn = dialog.locator('button', { hasText: 'High' })
    const box = await highBtn.boundingBox()
    assert.ok(box, 'Priority button should have a bounding box')
    assert.ok(box.height >= 36, `Priority button height (${box.height}) should be >= 36px`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })
}
