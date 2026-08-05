/**
 * Reloads the page until the given locator's text starts with the expected value, or the retries are exhausted
 *
 * Some statuses (for example, a notification's send status) are only updated on the server and never pushed to the
 * page, so Playwright's usual auto-retrying assertions won't see the change without a fresh page load.
 *
 * @param {import('@playwright/test').Page} page - The page to reload
 * @param {import('@playwright/test').Locator} locator - The locator whose text is checked after each reload
 * @param {string} textToMatch - The text the locator's content must start with
 * @param {number} [retries=10] - How many times to reload and re-check before giving up
 * @param {number} [retryWait=2000] - How long to wait, in milliseconds, before each reload
 *
 * @returns {Promise<void>}
 */
export async function reloadUntilTextFound(page, locator, textToMatch, retries = 10, retryWait = 2000) {
  if (retries === 0) {
    throw new Error(`Exhausted retries looking for ${textToMatch}.`)
  }

  const text = await locator.textContent()

  if (text?.trim().startsWith(textToMatch)) {
    return
  }

  await page.waitForTimeout(retryWait)
  await page.reload()
  await reloadUntilTextFound(page, locator, textToMatch, retries - 1, retryWait)
}

/**
 * Reloads the page until the given locator matches no elements, or the retries are exhausted
 *
 * Mirrors {@link reloadUntilTextFound}, but for waiting on something to be removed rather than to appear, for
 * example a bill run's row disappearing from the list once its background deletion completes.
 *
 * @param {import('@playwright/test').Page} page - The page to reload
 * @param {import('@playwright/test').Locator} locator - The locator that should eventually match no elements
 * @param {number} [retries=10] - How many times to reload and re-check before giving up
 * @param {number} [retryWait=2000] - How long to wait, in milliseconds, before each reload
 *
 * @returns {Promise<void>}
 */
export async function reloadUntilGone(page, locator, retries = 10, retryWait = 2000) {
  if (retries === 0) {
    throw new Error('Exhausted retries waiting for element to be removed.')
  }

  const count = await locator.count()

  if (count === 0) {
    return
  }

  await page.waitForTimeout(retryWait)
  await page.reload()
  await reloadUntilGone(page, locator, retries - 1, retryWait)
}
