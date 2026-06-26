/**
 * Music player test — verify music search and player bar.
 */
export default async function musicPlayerTest({ page, test, assert, BASE_URL }) {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(BASE_URL + '/app')
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('header', { timeout: 10000 })

  const musicSheet = () => page.getByRole('dialog', { name: 'Music Search' })

  async function openMusicSheet() {
    if (await musicSheet().isVisible().catch(() => false)) {
      return
    }
    await page.locator('button[aria-label="Music player"]').click()
    await musicSheet().waitFor({ state: 'visible', timeout: 5000 })
  }

  test('music button is visible in header', async () => {
    const musicBtn = page.locator('button[aria-label="Music player"]')
    assert.ok(await musicBtn.isVisible(), 'Music button should be visible')
  })

  test('clicking music button opens search sheet', async () => {
    await openMusicSheet()
    assert.ok(await musicSheet().isVisible(), 'Music search sheet should open')
  })

  test('Quick Picks section shows presets', async () => {
    await openMusicSheet()
    const quickPicks = musicSheet().locator('p', { hasText: 'Quick Picks' })
    await quickPicks.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await quickPicks.isVisible(), 'Quick Picks section should be visible')

    const preset = musicSheet().getByText('Lofi Girl Radio')
    assert.ok(await preset.isVisible(), 'Lofi Girl Radio preset should be visible')
  })

  test('selecting a track shows player bar', async () => {
    await openMusicSheet()
    await musicSheet().getByRole('button', { name: 'Play Lofi Girl Radio' }).click()

    const playerBar = page.locator('[data-music-player-bar]')
    await playerBar.waitFor({ state: 'visible', timeout: 5000 })
    await playerBar.getByText('Lofi Girl Radio').waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await playerBar.isVisible(), 'Music player bar should appear')
  })

  test('player bar shows track title', async () => {
    const playerBar = page.locator('[data-music-player-bar]')
    const trackTitle = playerBar.getByText('Lofi Girl Radio')
    await trackTitle.waitFor({ state: 'visible', timeout: 5000 })
    assert.ok(await trackTitle.isVisible(), 'Track title should be shown in player bar')
  })

  test('Playlists section is visible', async () => {
    await openMusicSheet()
    const playlists = musicSheet().locator('p', { hasText: 'Playlists' })
    await playlists.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await playlists.isVisible(), 'Playlists section should be visible')
  })

  test('can create a new playlist', async () => {
    await openMusicSheet()
    const input = musicSheet().locator('input[placeholder="New playlist name..."]')
    await input.fill('My Test Playlist')
    await input.press('Enter')

    const playlist = musicSheet().locator('p', { hasText: 'My Test Playlist' })
    await playlist.waitFor({ state: 'visible', timeout: 3000 })
    assert.ok(await playlist.isVisible(), 'New playlist should appear')
  })
}
