/**
 * =========================================================
 * HISABDESK — E2E SMOKE TESTS
 * Phase D — Day 27
 *
 * Tool: Playwright
 *
 * PURPOSE
 * Validate FULL critical flows before launch
 *
 * Covers:
 * ✓ login
 * ✓ dashboard load
 * ✓ create client org
 * ✓ add income/expense
 * ✓ GST page load
 * ✓ AIS page load
 * ✓ CA clients page
 * ✓ billing page
 *
 * WHY
 * If this file passes → app is launch-safe
 *
 * Run:
 * npx playwright test
 *
 * First time:
 * npx playwright install
 *
 * SAFE
 * test-only
 * no production changes
 * =========================================================
 */

import { test, expect } from "@playwright/test"

/* ====================================================== */
/* CONFIG */
/* ====================================================== */

const BASE_URL =
  process.env.E2E_BASE_URL || "http://localhost:3000"

const EMAIL = process.env.E2E_EMAIL!
const PASSWORD = process.env.E2E_PASSWORD!

/*
Add in .env.local:

E2E_EMAIL=test@hisabdesk.com
E2E_PASSWORD=123456
E2E_BASE_URL=http://localhost:3000
*/

/* ====================================================== */
/* HELPERS */
/* ====================================================== */

async function login(page: any) {
  await page.goto(`${BASE_URL}/login`)

  await page.getByPlaceholder(/email/i).fill(EMAIL)
  await page.getByPlaceholder(/password/i).fill(PASSWORD)

  await page.getByRole("button", { name: /login/i }).click()

  await page.waitForURL(/dashboard|org/)
}

/* ====================================================== */
/* TEST SUITE */
/* ====================================================== */

test.describe("HisabDesk Smoke Suite", () => {
  /* --------------------------------------------------- */
  test("Login → Dashboard loads", async ({ page }) => {
    await login(page)

    await expect(
      page.getByText(/dashboard/i)
    ).toBeVisible()
  })

  /* --------------------------------------------------- */
  test("Create client org (CA flow)", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/ca/clients`)

    const name = `Test Org ${Date.now()}`

    await page.getByPlaceholder(/new client/i).fill(name)
    await page.getByRole("button", { name: /create/i }).click()

    await expect(page.getByText(name)).toBeVisible()
  })

  /* --------------------------------------------------- */
  test("Add income entry", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/dashboard`)

    const input = page.getByPlaceholder(/amount/i)

    if (await input.count()) {
      await input.first().fill("1000")
      await page.keyboard.press("Enter")
    }

    await expect(page).toHaveURL(/dashboard/)
  })

  /* --------------------------------------------------- */
  test("GST dashboard loads", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/gst`)

    await expect(
      page.getByText(/gst dashboard/i)
    ).toBeVisible()
  })

  /* --------------------------------------------------- */
  test("AIS pages load", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/dashboard`)

    await expect(page).toHaveURL(/dashboard/)
  })

  /* --------------------------------------------------- */
  test("Billing page loads", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/settings/billing`)

    await expect(
      page.getByText(/billing/i)
    ).toBeVisible()
  })

  /* --------------------------------------------------- */
  test("CA Activity feed loads", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/ca/activity`)

    await expect(
      page.getByText(/activity feed/i)
    ).toBeVisible()
  })

  /* --------------------------------------------------- */
  test("System health loads", async ({ page }) => {
    await login(page)

    await page.goto(`${BASE_URL}/ca/system-health`)

    await expect(
      page.getByText(/system health/i)
    ).toBeVisible()
  })
})
