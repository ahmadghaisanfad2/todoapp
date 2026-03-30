/**
 * Playwright Test Runner for TodoFlow
 *
 * Uses `playwright` (core) directly — no @playwright/test dependency required.
 * Each test file exports a default async function that receives { page, browser, context }.
 * The runner discovers all *.test.mjs files in tests/ and runs them sequentially.
 *
 * Usage: node tests/run.mjs [optional-glob]
 */

import { chromium } from 'playwright'
import { readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'

/** @param {string} name @param {() => Promise<void>} fn */
function createSuite() {
  /** @type {{ name: string, fn: () => Promise<void> }[]} */
  const tests = []
  return {
    test: (name, fn) => tests.push({ name, fn }),
    run: async () => {
      let passed = 0
      let failed = 0
      const failures = []
      for (const t of tests) {
        try {
          await t.fn()
          passed++
          console.log(`  ✅ ${t.name}`)
        } catch (err) {
          failed++
          failures.push({ name: t.name, error: err })
          console.log(`  ❌ ${t.name}`)
          console.log(`     ${err.message}`)
        }
      }
      return { passed, failed, failures, total: tests.length }
    },
  }
}

async function main() {
  const filterArg = process.argv[2]

  // Discover test files
  const entries = await readdir(__dirname)
  let testFiles = entries.filter((f) => f.endsWith('.test.mjs')).sort()

  if (filterArg) {
    testFiles = testFiles.filter((f) => f.includes(filterArg))
  }

  if (testFiles.length === 0) {
    console.log('No test files found.')
    process.exit(0)
  }

  console.log(`\n🧪 TodoFlow Test Runner`)
  console.log(`   Base URL: ${BASE_URL}`)
  console.log(`   Tests: ${testFiles.length} file(s)\n`)

  const browser = await chromium.launch({ headless: true })
  let totalPassed = 0
  let totalFailed = 0

  for (const file of testFiles) {
    console.log(`📄 ${file}`)
    const mod = await import(join(__dirname, file))
    const suite = createSuite()

    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      await mod.default({ page, context, browser, test: suite.test, assert, BASE_URL })
      const result = await suite.run()
      totalPassed += result.passed
      totalFailed += result.failed
    } catch (err) {
      console.log(`  💥 Suite-level error: ${err.message}`)
      totalFailed++
    } finally {
      await page.close()
      await context.close()
    }
    console.log('')
  }

  await browser.close()

  console.log(`\n${'─'.repeat(40)}`)
  console.log(`Results: ${totalPassed} passed, ${totalFailed} failed, ${totalPassed + totalFailed} total`)
  console.log(`${'─'.repeat(40)}\n`)

  process.exit(totalFailed > 0 ? 1 : 0)
}

main()
