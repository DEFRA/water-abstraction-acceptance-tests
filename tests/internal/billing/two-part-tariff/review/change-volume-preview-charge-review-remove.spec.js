import scenarioData from '../../../../support/scenarios/two-part-tariff-review-01.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Two-part tariff review scenario 01 (internal)', () => {
  let endYear
  let licence
  let startYear

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()

    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = dates

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a SROC two-part tariff bill run and navigates through all the review pages, changing the billable returns volume, previewing the charge, marking the licence as review, marking progress and finally removing the licence from the bill run', async ({
    page
  }) => {
    const formattedCurrentDate = formatLongDate(new Date())

    await page.goto(`/system/licences/${licence.id}/summary`)

    // Confirm there are no flags already on the licence
    await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)

    // Click the Bill runs menu link
    await page.locator('#nav-bill-runs').click()

    // Bill runs ~ Click the Create a bill run button
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    // Which kind of bill run do you want to create? ~ Choose Two-part tariff then continue
    await page.getByRole('radio', { name: 'Two-part tariff', exact: true }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the region ~ Choose Test Region and continue
    await page.getByRole('radio', { name: 'Test Region' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the financial year ~ choose the most recent option (it is what the scenario seed data is setup for) and
    // continue
    await page.locator(`input[value="${endYear}"]`).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the bill run
    await page.getByRole('button', { name: 'Create bill run' }).click()

    // The bill run we created will be the top result. We expect its status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we look for the status REVIEW, and if not found reload the page and
    // try again. We then select it using the link on the date created
    await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'review')
    await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
    await expect(page.locator('[data-test="bill-run-total-0"]')).toContainText('')
    await page.locator('[data-test="date-created-0"] > .govuk-link').click()

    // Review licences ~ Test its the correct bill run
    await expect(page.locator('.govuk-body > .govuk-tag')).toContainText('review')
    await expect(page.locator('h1')).toContainText('Review licences')
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
    await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)

    // Review licences ~ Test you can filter by licence ref
    await page.locator('.govuk-details__summary').click()
    await page.locator('#licenceHolderNumber').fill('AT/1')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('#main-content')).toContainText('No licences found')
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await page.locator('.govuk-details__summary').click()
    await page.locator('#licenceHolderNumber').fill('AT/TE/ST/01/01')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
    await page.getByRole('button', { name: 'Clear filters' }).click()

    // Review licences ~ Test you can filter by licence holder
    await page.locator('.govuk-details__summary').click()
    await page.locator('#licenceHolderNumber').fill('Miss A Test')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('#main-content')).toContainText('No licences found')
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await page.locator('.govuk-details__summary').click()
    await page.locator('#licenceHolderNumber').fill('Big Farm Co Ltd')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

    // Review licences ~ Test it has the correct licence
    await expect(page.locator('[data-test="licence-1"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
    await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
    await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('')
    await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
    await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
    await page.locator('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TE/ST/01/01 ~ Check the licence details
    await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
    await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
    await expect(page.locator('div > .govuk-tag')).toContainText('ready')
    await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
      'Test Region two-part tariff'
    )
    await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )

    // Review Licence AT/TE/ST/01/01 ~ Check the Licence links
    await expect(page.locator('[data-test="summary-link"]')).toBeVisible()
    await expect(page.locator('[data-test="returns-link"]')).toBeVisible()
    await expect(page.locator('[data-test="charge-information-link"]')).toBeVisible()
    await expect(page.locator('[data-test="charge-period-0"]')).toBeVisible()
    await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toBeVisible()

    // Review Licence AT/TE/ST/01/01 ~ Check the return details
    await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
    await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText('9999990')
    await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
      '1 January to 31 December'
    )
    await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
      'Spray Irrigation - Storage'
    )
    await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
    await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('32 ML / 32 ML')

    // Review Licence AT/TE/ST/01/01 ~ Check there are no other returns
    await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
    await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

    // Review Licence AT/TE/ST/01/01 ~ Check charge Information details
    await expect(page.locator('[data-test="financial-year"]')).toContainText(
      `Financial year ${startYear} to ${endYear}`
    )
    await expect(page.locator('#charge-version-0 > .govuk-heading-l')).toContainText(
      `Charge periods 1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
      '1 charge reference with 1 two-part tariff charge element'
    )
    await expect(page.locator('.govuk-details__summary-text')).toContainText('Big Farm Co Ltd billing account details')
    await page.locator('.govuk-details__summary').click()
    await expect(page.locator('[data-test="billing-account"]')).toContainText('S99999991A')
    await expect(page.locator('[data-test="account-name"]')).toContainText('Big Farm Co Ltd')
    await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.3.1')
    await expect(page.locator('[data-test="charge-version-0-charge-description-0"]')).toContainText(
      'High loss, tidal, up to and including 75 ML/yr'
    )
    await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText('32 ML / 32 ML')
    await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
    await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-0"]')).toContainText(
      'Element 1 of 1'
    )
    await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')).toContainText(
      'SROC Charge Purpose 01'
    )
    await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')).toContainText(
      'Spray Irrigation - Direct'
    )
    await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(
      page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
    ).toContainText('')
    await expect(
      page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
    ).toContainText('32 ML / 32 ML')
    await expect(
      page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
    ).toContainText('32 ML (9999990)')

    // Review Licence AT/TE/ST/01/01 ~ Check there is only 1 charge version, charge reference and charge element
    await expect(page.locator('#charge-version-1 > .govuk-heading-l')).toHaveCount(0)
    await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toHaveCount(0)
    await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-1"]')).toHaveCount(0)
    await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()

    // Charge reference details
    await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.3.1')
    await expect(page.locator('[data-test="charge-reference-description"]')).toContainText(
      'High loss, tidal, up to and including 75 ML/yr'
    )
    await expect(page.locator('[data-test="financial-year"]')).toContainText(
      `Financial Year ${startYear} to ${endYear}`
    )
    await expect(page.locator('[data-test="charge-period"]')).toContainText(
      `Charge period 1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="total-billable-returns"]')).toContainText('32 ML')
    await expect(page.locator('[data-test="authorised-volume"]')).toContainText('32 ML')
    await expect(page.locator('[data-test="additional-charges"]')).toContainText('Public Water Supply')
    await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')

    // Charge reference details ~ Preview the charge
    await page.locator('.govuk-button').click()
    await expect(page.locator('.govuk-notification-banner')).toBeVisible()
    await page.locator('.govuk-back-link').click()

    // View match details
    await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    await expect(page.locator('.govuk-heading-l')).toContainText('SROC Charge Purpose 01')
    await expect(page.locator('[data-test="charge-period-0"]')).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('.govuk-grid-column-full > .govuk-tag')).toContainText('ready')
    await expect(page.locator('[data-test="financial-year"]')).toContainText(
      `Financial year ${startYear} to ${endYear}`
    )
    await expect(page.locator('[data-test="charge-period"]')).toContainText(
      `Charge period 1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="billable-returns"]')).toContainText('32 ML')
    await expect(page.locator('[data-test="authorised-volume"]')).toContainText('32 ML')
    await expect(page.locator('[data-test="issues-0"]')).toHaveCount(0)
    await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText('9999990')
    await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Storage')
    await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('TANKS ON JUPITER')
    await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
    await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('32 ML / 32 ML')

    // View match details ~ Edit the billable returns
    await page.locator('.govuk-button').click()
    await expect(page.locator('.govuk-caption-l')).toContainText('SROC Charge Purpose 01')
    await expect(page.locator('[data-test="charge-period-0"]')).toContainText(
      `1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
    await expect(page.locator('[data-test="financial-year"]')).toContainText(
      `Financial year ${startYear} to ${endYear}`
    )
    await expect(page.locator('[data-test="charge-period"]')).toContainText(
      `Charge period 1 April ${startYear} to 31 March ${endYear}`
    )
    await expect(page.locator('[data-test="authorised-quantity"]')).toContainText('Authorised 32ML')
    await page.locator('#custom-quantity-selector').check()
    await page.locator('#custom-quantity').fill('20.123')
    await page.locator('.govuk-button').click()

    // View match details ~ Check billable returns has updated
    await expect(page.locator('.govuk-notification-banner')).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
      'The billable returns for this licence have been updated'
    )
    await expect(page.locator('[data-test="billable-returns"]')).toContainText('20.123 ML')
    await page.locator('.govuk-back-link').click()

    // Review Licence AT/TE/ST/01/01 ~ Check billable returns has updated on licence review page
    await expect(
      page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
    ).toContainText('20.123 ML / 32 ML')

    // Review Licence AT/TE/ST/01/01 ~ Put licence into review
    await page.getByText('Put licence into review').click()
    await expect(page.locator('.govuk-notification-banner')).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Licence changed to review.')
    await expect(page.locator('div > .govuk-tag')).toContainText('review')
    await expect(page.locator('.govuk-button--primary')).toContainText('Confirm licence is ready')

    // Review Licence AT/TE/ST/01/01 ~ Mark licence progress
    await page.getByText('Mark progress').click()
    await expect(page.locator('.govuk-notification-banner')).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('This licence has been marked.')
    await expect(page.locator('button.govuk-button--secondary')).toContainText('Remove progress mark')

    // Review Licence AT/TE/ST/01/01 ~ Remove licence from bill run
    await page.getByText('Remove from bill run').click()
    await expect(page.locator('.govuk-heading-xl')).toContainText(
      "You're about to remove AT/TE/ST/01/01 from the bill run"
    )
    await expect(page.locator('.govuk-inset-text')).toContainText(
      'The licence will go into the next two-part tariff supplementary bill run.'
    )
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
    await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)
    await page.locator('.govuk-button').click()

    // Bill runs ~ Check the bill run is now empty as the licence has been removed
    await expect(page.locator('[data-test="bill-run-status-0"] > .govuk-tag')).toContainText('empty')

    // Search the licence that was removed
    await page.locator('#nav-search').click()
    await page.locator('#query').fill('AT/TE/ST/01/01')
    await page.locator('#search-button').click()
    await page.locator('.searchresult-row', { hasText: 'AT/TE/ST/01/01' }).getByRole('link').click()

    // Confirm the licence has been flagged for two-part tariff supplementary billing
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next two-part tariff supplementary bill run.'
    )
  })
})
