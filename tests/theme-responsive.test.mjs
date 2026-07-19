/**
 * Theme and responsive regression tests.
 */
export default async function themeResponsiveTests({ page, test, assert, BASE_URL }) {
  // Start fresh
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')

  await page.evaluate(() => {
    localStorage.removeItem('wazheefa-settings')
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  async function mobileAddTaskFab() {
    return page.locator('button.fixed.sm\\:hidden[aria-label="Add task"]')
  }

  async function ensureKanbanVisible() {
    const hasColumns = (await page.locator('[data-kanban-column]').count()) > 0
    if (hasColumns) return

    const addFirst = page.getByRole('button', { name: 'Add first task' })
    if (await addFirst.isVisible()) {
      await addFirst.click()
      const dialog = page.getByRole('dialog', { name: /Add task/i })
      await dialog.waitFor({ state: 'visible', timeout: 5000 })
      await dialog.locator('#task-title').fill('Mobile layout seed')
      await dialog.locator('button[type="submit"]').click()
      await dialog.waitFor({ state: 'hidden', timeout: 3000 })
    }
  }

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
    await ensureKanbanVisible()

    // Core elements should still be visible
    const backBtn = page.getByRole('button', { name: /Back to home/i })
    assert.ok(await backBtn.isVisible(), 'App shell back control should be visible on mobile')

    const board = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'To Do' }),
    })
    assert.ok(await board.isVisible(), 'Kanban board should be visible on mobile')

    const fab = await mobileAddTaskFab()
    assert.ok(await fab.isVisible(), 'FAB should be visible on mobile')
  })

  test('FAB is visible and clickable on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    await ensureKanbanVisible()

    const fab = await mobileAddTaskFab()
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
    await ensureKanbanVisible()

    const fab = await mobileAddTaskFab()
    await fab.click()
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 })

    const box = await dialog.boundingBox()
    assert.ok(box, 'Dialog should have a bounding box on mobile')
    assert.ok(box.width <= 375, `Dialog width (${box.width}) should fit within 375px viewport`)

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden', timeout: 3000 })
  })

  test('Kanban columns remain reachable at mobile width', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    await ensureKanbanVisible()

    const column = page.locator('[data-kanban-column]').filter({
      has: page.getByRole('heading', { name: 'To Do' }),
    })
    const box = await column.boundingBox()
    assert.ok(box, 'To Do column should have a bounding box')
    assert.ok(box.width <= 320, `Column width (${box.width}) should fit within the horizontal board scroller`)
  })

  test('custom top scrollbar enables reaching all columns at mobile width', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    await ensureKanbanVisible()

    const board = page.locator('[data-kanban-board]')
    assert.ok(await board.isVisible(), 'Kanban board container should be visible')

    const scrollbarTrack = board.locator('[data-kanban-scrollbar-track]')
    assert.ok(
      await scrollbarTrack.isVisible(),
      'Custom horizontal scrollbar track should be visible when columns overflow'
    )

    const doneReachableBefore = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('[data-kanban-column] h2')]
      const done = headings.find((h) => h.textContent === 'Done')
      if (!done) return false
      const rect = done.getBoundingClientRect()
      return rect.left < window.innerWidth && rect.right > 0
    })
    assert.ok(!doneReachableBefore, 'Done column should start off-screen on mobile')

    await page.evaluate(() => {
      const scrollEl = document.getElementById('kanban-board-scroll')
      const column = [...document.querySelectorAll('[data-kanban-column]')].find(
        (c) => c.querySelector('h2')?.textContent === 'Done'
      )
      if (!scrollEl || !column) return
      scrollEl.scrollLeft = column.offsetLeft
    })
    await page.waitForTimeout(200)

    const doneReachableAfter = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('[data-kanban-column] h2')]
      const done = headings.find((h) => h.textContent === 'Done')
      if (!done) return false
      const rect = done.getBoundingClientRect()
      return rect.left < window.innerWidth && rect.right > 0
    })
    assert.ok(doneReachableAfter, 'Done column should be reachable after horizontal scroll')
  })

  test('kanban board allows horizontal touch panning on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    await ensureKanbanVisible()

    const scrollEl = page.locator('#kanban-board-scroll')
    await scrollEl.waitFor({ state: 'visible', timeout: 3000 })

    const touchAction = await scrollEl.evaluate((el) => getComputedStyle(el).touchAction)
    assert.ok(
      touchAction.includes('pan-x'),
      `Board scroller touch-action should allow pan-x (got "${touchAction}")`
    )

    const columnBody = page.locator('[data-kanban-column-body]').first()
    const columnTouchAction = await columnBody.evaluate((el) => getComputedStyle(el).touchAction)
    assert.ok(
      columnTouchAction.includes('pan-x'),
      `Column body should allow pan-x so horizontal swipes are not trapped (got "${columnTouchAction}")`
    )

    const card = page.locator('[data-kanban-card]').first()
    if (await card.count()) {
      const cardTouchAction = await card.evaluate((el) => getComputedStyle(el).touchAction)
      assert.ok(
        !cardTouchAction.split(/\s+/).includes('none'),
        `Idle kanban cards must not use touch-action:none (got "${cardTouchAction}")`
      )
    }

    const scrolled = await page.evaluate(() => {
      const el = document.getElementById('kanban-board-scroll')
      if (!el) return { ok: false, before: 0, after: 0, reason: 'missing scroller' }

      const target = el.querySelector('[data-kanban-column-body]') ?? el
      const rect = target.getBoundingClientRect()
      const startX = rect.left + rect.width * 0.8
      const startY = rect.top + Math.min(rect.height * 0.4, 120)
      const before = el.scrollLeft

      const createTouch = (clientX, clientY) =>
        new Touch({
          identifier: 1,
          target,
          clientX,
          clientY,
          pageX: clientX,
          pageY: clientY,
          screenX: clientX,
          screenY: clientY,
        })

      const fire = (type, clientX, clientY) => {
        const touch = createTouch(clientX, clientY)
        target.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            composed: true,
            touches: type === 'touchend' || type === 'touchcancel' ? [] : [touch],
            targetTouches: type === 'touchend' || type === 'touchcancel' ? [] : [touch],
            changedTouches: [touch],
          })
        )
      }

      fire('touchstart', startX, startY)
      fire('touchmove', startX - 30, startY)
      fire('touchmove', startX - 110, startY)
      fire('touchmove', startX - 220, startY)
      fire('touchend', startX - 220, startY)

      return { ok: true, before, after: el.scrollLeft }
    })

    assert.ok(scrolled.ok, 'Touch pan simulation should run against the board scroller')
    assert.ok(
      scrolled.after > scrolled.before,
      `Horizontal touch pan should increase scrollLeft (before=${scrolled.before}, after=${scrolled.after})`
    )

    const snapClass = await scrollEl.getAttribute('class')
    assert.ok(
      snapClass?.includes('snap-proximity'),
      'Board should use snap-proximity instead of snap-mandatory for freer mobile swipes'
    )
    assert.ok(
      !snapClass?.includes('scroll-smooth'),
      'Board should not use scroll-smooth (fights touch inertia)'
    )
  })
}
