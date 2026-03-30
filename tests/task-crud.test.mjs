/**
 * Task CRUD regression tests — covers create, edit, complete, delete after UI refresh.
 */
export default async function taskCrudTests({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')

  // Clear any localStorage state for clean run
  await page.evaluate(() => {
    localStorage.removeItem('todoflow-tasks')
    localStorage.removeItem('todoflow-settings')
    localStorage.removeItem('todoflow-categories')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  test('shows default empty state when no tasks exist', async () => {
    const emptyMsg = page.locator('text=No tasks yet')
    assert.ok(await emptyMsg.isVisible(), 'Default empty state should show "No tasks yet"')
  })

  test('can create a task via FAB', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.getByRole('dialog', { name: /Add Task/ })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    // Fill title
    await dialog.locator('#task-title').fill('Buy groceries')

    // Select High priority
    const highBtn = dialog.locator('button', { hasText: 'High' })
    await highBtn.click()

    // Submit
    const submitBtn = dialog.locator('button[type="submit"]')
    await submitBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    // Verify task appears
    const task = page.locator('text=Buy groceries')
    assert.ok(await task.isVisible(), 'Created task should appear in the list')
  })

  test('task dialog is wider than baseline (sm:max-w-md)', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.getByRole('dialog', { name: /Add Task/ })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const box = await dialog.boundingBox()
    assert.ok(box, 'Dialog should have a bounding box')
    // sm:max-w-md = 448px, should be wider than the old sm:max-w-sm = 384px
    assert.ok(box.width >= 400, `Dialog width (${box.width}) should be >= 400px`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  test('can create a second task', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.getByRole('dialog', { name: /Add Task/ })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    await dialog.locator('#task-title').fill('Clean the house')
    const submitBtn = dialog.locator('button[type="submit"]')
    await submitBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    const task = page.locator('text=Clean the house')
    assert.ok(await task.isVisible(), 'Second task should appear')
  })

  test('can complete a task', async () => {
    // Find the task card by its label text, then traverse to the card root
    const label = page.locator('label', { hasText: 'Buy groceries' })
    // The card structure is: div.card > Checkbox + div > label
    // Go up to the card root (which has the checkbox as a direct child)
    const checkbox = label.locator('..').locator('..').locator('button[role="checkbox"]')
    await checkbox.click()
    await page.waitForTimeout(500)

    // The completed section should now exist
    const completedHeader = page.locator('text=Completed')
    assert.ok(await completedHeader.isVisible(), 'Completed section header should appear')
  })

  test('section headers use stronger styling (font-semibold)', async () => {
    const activeHeader = page.locator('p', { hasText: /Active/ })
    const classes = await activeHeader.getAttribute('class')
    assert.ok(classes?.includes('font-semibold'), 'Active header should use font-semibold')
  })

  test('can edit a task', async () => {
    // Find the "Clean the house" label, go up to the card, find the dropdown trigger
    const label = page.locator('label', { hasText: 'Clean the house' })
    // Card structure: div.card > [checkbox, content-div, actions-div]
    // The MoreVertical button has aria-haspopup="menu"
    const card = label.locator('xpath=ancestor::div[contains(@class, "border") and contains(@class, "bg-card")]')
    const menuBtn = card.locator('button[aria-haspopup="menu"]')
    await menuBtn.click()

    const editItem = page.getByRole('menuitem', { name: 'Edit' })
    await editItem.waitFor({ state: 'visible', timeout: 3000 })
    await editItem.click()

    const dialog = page.getByRole('dialog', { name: /Edit Task/ })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    await dialog.locator('#task-title').fill('Clean the kitchen')
    const saveBtn = dialog.locator('button[type="submit"]')
    await saveBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })

    const updatedTask = page.locator('text=Clean the kitchen')
    assert.ok(await updatedTask.isVisible(), 'Edited task should show new title')
  })

  test('can delete a task', async () => {
    const label = page.locator('label', { hasText: 'Clean the kitchen' })
    const card = label.locator('xpath=ancestor::div[contains(@class, "border") and contains(@class, "bg-card")]')
    const menuBtn = card.locator('button[aria-haspopup="menu"]')
    await menuBtn.click()

    const deleteItem = page.getByRole('menuitem', { name: 'Delete' })
    await deleteItem.waitFor({ state: 'visible', timeout: 3000 })
    await deleteItem.click()
    await page.waitForTimeout(500)

    const deleted = page.locator('text=Clean the kitchen')
    assert.equal(await deleted.count(), 0, 'Deleted task should no longer appear')
  })

  test('priority buttons have larger touch targets after refresh', async () => {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.getByRole('dialog', { name: /Add Task/ })
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const highBtn = dialog.locator('button', { hasText: 'High' })
    const box = await highBtn.boundingBox()
    assert.ok(box, 'Priority button should have a bounding box')
    // Old was py-1.5 (~30px), new is py-2.5 (~40px+)
    assert.ok(box.height >= 36, `Priority button height (${box.height}) should be >= 36px`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })
}
