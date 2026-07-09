/**
 * Locates the value cell of a govuk-summary-list row identified by its label, scoped to the given container
 *
 * @param {import('@playwright/test').Locator} container - the dl (or an ancestor of it) to search within
 * @param {string} label - the text of the row's label (dt) to match
 *
 * @returns {import('@playwright/test').Locator} the row's value cell (dd.govuk-summary-list__value)
 */
export function summaryListValue(container, label) {
  return container
    .locator('.govuk-summary-list__row')
    .filter({ has: container.page().getByText(label, { exact: true }) })
    .locator('.govuk-summary-list__value')
}
