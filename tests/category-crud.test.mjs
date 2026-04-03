/**
 * Category CRUD regression tests — covers create, edit, delete categories.
 */
export default async function categoryCrudTests({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')

  // Clear state
  await page.evaluate(() => {
    localStorage.removeItem('wazheefa-tasks')
    localStorage.removeItem('wazheefa-settings')
    localStorage.removeItem('wazheefa-categories')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  // Helper: get the category sheet (SheetContent has role="dialog" with title "Categories")
  const getSheet = () => page.getByRole('dialog', { name: 'Categories' })

  test('can open category sheet', async () => {
    const catBtn = page.locator('button[aria-label="Manage categories"]')
    await catBtn.click()
    const sheet = getSheet()
    await sheet.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await sheet.isVisible(), 'Category sheet should open')
  })

  test('category sheet shows empty message when no categories', async () => {
    const sheet = getSheet()
    const emptyMsg = sheet.locator('text=No categories yet')
    assert.ok(await emptyMsg.isVisible(), 'Empty message should show')
  })

  test('can create a category', async () => {
    const sheet = getSheet()
    const addBtn = sheet.locator('button', { hasText: 'Add Category' })
    await addBtn.click()

    // The CategoryForm dialog has title "Add Category" or "Edit Category"
    const catDialog = page.getByRole('dialog', { name: /Add Category/ })
    await catDialog.waitFor({ state: 'visible', timeout: 5000 })

    await catDialog.locator('#cat-name').fill('Work')
    const saveBtn = catDialog.locator('button[type="submit"]')
    await saveBtn.click()
    await catDialog.waitFor({ state: 'hidden', timeout: 3000 })

    // Category should appear in the sheet
    const cat = sheet.locator('text=Work')
    assert.ok(await cat.isVisible(), 'Created category should appear in the sheet')
  })

  test('category action buttons have larger touch targets (h-9 w-9)', async () => {
    const sheet = getSheet()
    // Find the edit button (Pencil icon) inside the category row
    const catRow = sheet.locator('div.rounded-lg.border', { hasText: 'Work' })
    const editBtn = catRow.locator('button').first()
    const box = await editBtn.boundingBox()
    assert.ok(box, 'Action button should have a bounding box')
    // h-9 = 36px
    assert.ok(box.height >= 34, `Action button height (${box.height}) should be >= 34px`)
  })

  test('can edit a category', async () => {
    const sheet = getSheet()
    // Click the edit button (pencil icon) for "Work" — it's the first button in the row
    const catRow = sheet.locator('div.rounded-lg.border', { hasText: 'Work' })
    const editBtn = catRow.locator('button').first()
    await editBtn.click()

    const catDialog = page.getByRole('dialog', { name: /Edit Category/ })
    await catDialog.waitFor({ state: 'visible', timeout: 5000 })

    await catDialog.locator('#cat-name').fill('Work Projects')
    const saveBtn = catDialog.locator('button[type="submit"]')
    await saveBtn.click()
    await catDialog.waitFor({ state: 'hidden', timeout: 3000 })

    const updatedCat = sheet.locator('text=Work Projects')
    assert.ok(await updatedCat.isVisible(), 'Edited category should show new name')
  })

  test('can delete a category', async () => {
    // Handle the confirm dialog
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    const sheet = getSheet()
    const catRow = sheet.locator('div.rounded-lg.border', { hasText: 'Work Projects' })
    // Delete button is the last button (with text-destructive class)
    const deleteBtn = catRow.locator('button.text-destructive')
    await deleteBtn.click()
    await page.waitForTimeout(500)

    const deleted = sheet.locator('text=Work Projects')
    assert.equal(await deleted.count(), 0, 'Deleted category should no longer appear')
  })

  test('can close category sheet', async () => {
    // Press escape or click close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  })
}
