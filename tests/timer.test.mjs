/**
 * Timer test — verify focus timer functionality.
 */
export default async function timerTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('h1', { timeout: 10000 })

  test('timer FAB is visible', async () => {
    const timerBtn = page.locator('button[aria-label="Open focus timer"]')
    await timerBtn.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await timerBtn.isVisible(), 'Timer button should be visible')
  })

  test('clicking timer FAB shows preset durations', async () => {
    const timerBtn = page.locator('button[aria-label="Open focus timer"]')
    await timerBtn.click()

    const preset = page.locator('button', { hasText: '5 min' })
    await preset.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await preset.isVisible(), 'Preset buttons should appear')
  })

  test('starting a timer shows countdown', async () => {
    const preset = page.locator('button', { hasText: '2 min' })
    await preset.click()

    // Timer should show running state with a time display
    const timeDisplay = page.locator('span.font-mono.font-bold', { hasText: /\d{2}:\d{2}/ })
    await timeDisplay.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await timeDisplay.isVisible(), 'Timer countdown should be visible')
  })

  test('pause button is visible during timer', async () => {
    const pauseBtn = page.locator('button[aria-label="Pause"]')
    assert.ok(await pauseBtn.isVisible(), 'Pause button should be visible while timer runs')
  })

  test('pausing timer shows resume button', async () => {
    const pauseBtn = page.locator('button[aria-label="Pause"]')
    await pauseBtn.click()

    const resumeBtn = page.locator('button[aria-label="Resume"]')
    await resumeBtn.waitFor({ state: 'visible', timeout: 2000 })
    assert.ok(await resumeBtn.isVisible(), 'Resume button should appear after pause')
  })

  test('stopping timer returns to idle', async () => {
    const stopBtn = page.locator('button[aria-label="Stop timer"]')
    await stopBtn.click()

    // Timer FAB should reappear
    const timerBtn = page.locator('button[aria-label="Open focus timer"]')
    await timerBtn.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await timerBtn.isVisible(), 'Timer FAB should reappear after stop')
  })
}
