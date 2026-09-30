/**
 * Locates a bill run's row on the bill runs page by its region and bill run type
 *
 * Specs run in parallel, so a new bill run is not always the top row. Each region only has one bill run of a type
 * being created at a time, so region and type together identify it.
 *
 * @param {import('@playwright/test').Page} page - The bill runs page
 * @param {object} region - The region, for example `regions.MIDLANDS`
 * @param {string} type - The bill run type exactly as the list shows it, for example 'Annual' or 'Two-part tariff'
 * @param {object} [options]
 * @param {boolean} [options.oldChargeScheme] - Creating a supplementary bill run creates an old (presroc) and a current
 * (sroc) one of the same type in the same region. The list marks the old one with 'Old charge scheme', so pass true for
 * that row and false for the current one. Leave it out when the type is enough.
 * @param {boolean} [options.sent] - Pass false to skip bill runs that have already been sent, for when a spec creates
 * more than one bill run of the same type in the same region and wants the one it has just created.
 *
 * @returns {import('@playwright/test').Locator} The matching bill runs table row
 */
export function billRunRow(page, region, type, { oldChargeScheme, sent } = {}) {
  let row = page
    .locator('table.govuk-table')
    .getByRole('row')
    .filter({ hasText: region.displayName })
    .filter({ has: page.getByRole('cell', { name: type, exact: true }) })

  if (oldChargeScheme === true) {
    row = row.filter({ hasText: 'Old charge scheme' })
  }

  if (oldChargeScheme === false) {
    row = row.filter({ hasNotText: 'Old charge scheme' })
  }

  if (sent === false) {
    row = row.filter({ hasNot: page.locator('.govuk-tag', { hasText: 'sent' }) })
  }

  return row
}

/**
 * Locates a bill run's row on the bill runs page by the link to that bill run
 *
 * For when a spec has already opened its bill run and so knows its URL, and there may be other bill runs of the same
 * type in the same region.
 *
 * @param {import('@playwright/test').Page} page - The bill runs page
 * @param {string} billRunUrl - The bill run's URL, for example as returned by `page.url()` when on the bill run
 *
 * @returns {import('@playwright/test').Locator} The matching bill runs table row
 */
export function billRunRowByLink(page, billRunUrl) {
  const { pathname } = new URL(billRunUrl)

  return page
    .locator('table.govuk-table')
    .getByRole('row')
    .filter({ has: page.locator(`a[href="${pathname}"]`) })
}
