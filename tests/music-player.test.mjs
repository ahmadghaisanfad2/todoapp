/**
 * Music player test — verify music search and player bar.
 */
export default async function musicPlayerTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('h1', { timeout: 10000 })

  test('music button is visible in header', async () => {
    const musicBtn = page.locator('button[aria-label="Music player"]')
    assert.ok(await musicBtn.isVisible(), 'Music button should be visible')
  })

  test('clicking music button opens search sheet', async () => {
    const musicBtn = page.locator('button[aria-label="Music player"]')
    await musicBtn.click()

    const sheet = page.locator('[data-side="bottom"]')
    await sheet.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await sheet.isVisible(), 'Music search sheet should open')
  })

  test('Quick Picks section shows presets', async () => {
    const quickPicks = page.locator('p', { hasText: 'Quick Picks' })
    await quickPicks.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await quickPicks.isVisible(), 'Quick Picks section should be visible')

    // Should have at least one preset card
    const presetCards = page.locator('[data-side="bottom"] >> text=Lofi Girl Radio')
    assert.ok(await presetCards.isVisible(), 'Lofi Girl Radio preset should be visible')
  })

  test('selecting a track shows player bar', async () => {
    // Click play on the first preset
    const firstPreset = page.locator('[data-side="bottom"] >> text=Lofi Girl Radio').locator('..').locator('..')
    const playBtn = firstPreset.locator('button').last()
    await playBtn.click()

    // Player bar should appear at the bottom
    const playerBar = page.locator('.fixed.bottom-0')
    await playerBar.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await playerBar.isVisible(), 'Music player bar should appear')
  })

  test('player bar shows track title', async () => {
    const trackTitle = page.locator('.fixed.bottom-0 >> text=Lofi Girl Radio')
    assert.ok(await trackTitle.isVisible(), 'Track title should be shown in player bar')
  })

  test('Playlists section is visible', async () => {
    // Reopen the search sheet
    const musicBtn = page.locator('button[aria-label="Music player"]')
    await musicBtn.click()

    const playlists = page.locator('p', { hasText: 'Playlists' })
    await playlists.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await playlists.isVisible(), 'Playlists section should be visible')
  })

  test('can create a new playlist', async () => {
    const input = page.locator('input[placeholder="New playlist name..."]')
    await input.fill('My Test Playlist')

    const createBtn = page.locator('button', { hasText: 'Create' })
    await createBtn.click()

    const playlist = page.locator('p', { hasText: 'My Test Playlist' })
    await playlist.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await playlist.isVisible(), 'New playlist should appear')
  })
}
