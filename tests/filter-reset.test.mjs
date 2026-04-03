/**
 * Filter and reset regression tests — covers filter application, reset, and differentiated empty states.
 */
export default async function filterTests({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')

  // Setup: clear state and create test tasks
  await page.evaluate(() => {
    localStorage.removeItem('wazheefa-tasks')
    localStorage.removeItem('wazheefa-settings')
    localStorage.removeItem('wazheefa-categories')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  // Create two tasks with different priorities
  async function createTask(title, priority) {
    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    await page.fill('#task-title', title)
    if (priority) {
      const btn = dialog.locator('button', { hasText: priority })
      await btn.click()
    }
    const submitBtn = dialog.locator('button[type="submit"]')
    await submitBtn.click()
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  }

  await createTask('Important meeting', 'High')
  await createTask('Casual reading', 'Low')

  test('filter controls have larger height (h-10 = 40px)', async () => {
    const trigger = page.locator('button[role="combobox"]').first()
    const box = await trigger.boundingBox()
    assert.ok(box, 'Select trigger should have a bounding box')
    assert.ok(box.height >= 38, `Select trigger height (${box.height}) should be >= 38px`)
  })

  test('can apply priority filter', async () => {
    // Open priority select (second combobox)
    const priorityTrigger = page.locator('button[role="combobox"]').nth(1)
    await priorityTrigger.click()
    const highOption = page.locator('[role="option"]', { hasText: 'High' })
    await highOption.waitFor({ state: 'visible', timeout: 3000 })
    await highOption.click()
    await page.waitForTimeout(500)

    // Should show Important meeting but not Casual reading
    const important = page.locator('text=Important meeting')
    assert.ok(await important.isVisible(), 'High-priority task should be visible')
    const casual = page.locator('text=Casual reading')
    assert.equal(await casual.count(), 0, 'Low-priority task should be hidden')
  })

  test('clear filters button appears when filters are active', async () => {
    const clearBtn = page.locator('button', { hasText: 'Clear filters' })
    assert.ok(await clearBtn.isVisible(), 'Clear filters button should appear when filters are active')
  })

  test('clear filters resets all filters and search', async () => {
    // Also add a search query
    await page.fill('input[placeholder="Search tasks..."]', 'something')
    await page.waitForTimeout(300)

    const clearBtn = page.locator('button', { hasText: 'Clear filters' })
    await clearBtn.click()
    await page.waitForTimeout(500)

    // Both tasks should be visible again
    const important = page.locator('text=Important meeting')
    const casual = page.locator('text=Casual reading')
    assert.ok(await important.isVisible(), 'All tasks should be visible after reset')
    assert.ok(await casual.isVisible(), 'All tasks should be visible after reset')

    // Search field should be cleared
    const searchVal = await page.locator('input[placeholder="Search tasks..."]').inputValue()
    assert.equal(searchVal, '', 'Search should be cleared after reset')
  })

  test('filtered empty state shows "No matching tasks" message', async () => {
    // Search for something that doesn't exist
    await page.fill('input[placeholder="Search tasks..."]', 'zzz-nonexistent-query')
    await page.waitForTimeout(500)

    const noMatching = page.locator('text=No matching tasks')
    assert.ok(await noMatching.isVisible(), 'Should show "No matching tasks" when filters yield no results')

    const adjustMsg = page.locator('text=Try adjusting your filters')
    assert.ok(await adjustMsg.isVisible(), 'Should show helpful message to adjust filters')

    // Clear to restore
    const clearBtn = page.locator('button', { hasText: 'Clear filters' })
    await clearBtn.click()
    await page.waitForTimeout(300)
  })

  test('clear filters button disappears when no filters are active', async () => {
    const clearBtn = page.locator('button', { hasText: 'Clear filters' })
    assert.equal(await clearBtn.count(), 0, 'Clear filters button should not appear when no filters are active')
  })
}
