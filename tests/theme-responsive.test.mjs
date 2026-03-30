/**
 * Theme and responsive regression tests.
 */
export default async function themeResponsiveTests({ page, test, assert, BASE_URL }) {
  // Start fresh
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')

  await page.evaluate(() => {
    localStorage.removeItem('todoflow-settings')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  test('theme toggle cycles through system → light → dark', async () => {
    const themeBtn = page.locator('button[aria-label^="Switch theme"]')

    // Initial state: system
    const initialLabel = await themeBtn.getAttribute('aria-label')
    assert.ok(initialLabel?.includes('system'), `Initial theme should be system, got: ${initialLabel}`)

    // Click → light
    await themeBtn.click()
    await page.waitForTimeout(300)
    const lightLabel = await themeBtn.getAttribute('aria-label')
    assert.ok(lightLabel?.includes('light'), `After first click should be light, got: ${lightLabel}`)

    // Click → dark
    await themeBtn.click()
    await page.waitForTimeout(300)
    const darkLabel = await themeBtn.getAttribute('aria-label')
    assert.ok(darkLabel?.includes('dark'), `After second click should be dark, got: ${darkLabel}`)

    // Verify dark class on html
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    assert.ok(hasDark, 'HTML element should have dark class in dark mode')

    // Click → system (back to start)
    await themeBtn.click()
    await page.waitForTimeout(300)
    const systemLabel = await themeBtn.getAttribute('aria-label')
    assert.ok(systemLabel?.includes('system'), `After third click should be system, got: ${systemLabel}`)
  })

  test('header shows text labels on desktop (sm breakpoint)', async () => {
    const catLabel = page.locator('button[aria-label="Manage categories"] span', { hasText: 'Categories' })
    assert.ok(await catLabel.isVisible(), 'Categories text label should be visible on desktop')
  })

  test('app renders correctly at mobile width (375px)', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)

    // Core elements should still be visible
    const title = page.locator('h1', { hasText: 'TodoFlow' })
    assert.ok(await title.isVisible(), 'Title should be visible on mobile')

    const search = page.locator('input[placeholder="Search tasks..."]')
    assert.ok(await search.isVisible(), 'Search should be visible on mobile')

    const fab = page.locator('button[aria-label="Add task"]')
    assert.ok(await fab.isVisible(), 'FAB should be visible on mobile')
  })

  test('FAB is visible and clickable on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)

    const fab = page.locator('button[aria-label="Add task"]')
    const box = await fab.boundingBox()
    assert.ok(box, 'FAB should have a bounding box on mobile')
    assert.ok(box.x + box.width <= 375, 'FAB should be within mobile viewport')
    assert.ok(box.y + box.height <= 812, 'FAB should be within mobile viewport vertically')

    await fab.click()
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await dialog.isVisible(), 'Dialog should open from FAB on mobile')

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  test('task dialog fits within mobile viewport', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)

    const fab = page.locator('button[aria-label="Add task"]')
    await fab.click()
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const box = await dialog.boundingBox()
    assert.ok(box, 'Dialog should have a bounding box on mobile')
    assert.ok(box.width <= 375, `Dialog width (${box.width}) should fit within 375px viewport`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  // Reset viewport back to desktop
  test('filter controls remain usable at mobile width', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)

    const triggers = page.locator('button[role="combobox"]')
    const count = await triggers.count()
    assert.ok(count >= 3, `Should have at least 3 filter controls, found ${count}`)

    // Check no controls are cut off (they should all be within viewport x bounds)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await triggers.nth(i).boundingBox()
      assert.ok(box, `Filter control ${i} should have a bounding box`)
      assert.ok(box.x >= 0, `Filter control ${i} should not be positioned off-screen left`)
    }
  })
}
