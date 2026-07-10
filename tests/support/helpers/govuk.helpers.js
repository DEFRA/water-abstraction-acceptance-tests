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
