/**
 * Locates the govuk-summary-list row whose label matches the given text
 *
 * @param {import('@playwright/test').Page} page - The page to search
 * @param {string} label - The text the row's label must match
 *
 * @returns {import('@playwright/test').Locator} The matching `.govuk-summary-list__row`
 */
export function summaryRow(page, label) {
  return page.locator('.govuk-summary-list__row', { hasText: label })
}

/**
 * Locates table row(s) containing the given text
 *
 * When two rows share identical text (for example, an old return log made void by a correction and a new one
 * covering the exact same period), this returns both - narrow further with `.filter()` on a second, distinguishing
 * piece of text (such as the return reference) to isolate one of them.
 *
 * @param {import('@playwright/test').Page} page - The page to search
 * @param {string} text - The text the row must contain
 *
 * @returns {import('@playwright/test').Locator} The matching table row(s)
 */
export function tableRow(page, text) {
  return page.locator('tr').filter({ hasText: text })
}
