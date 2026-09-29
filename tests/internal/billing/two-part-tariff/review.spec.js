import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { tableRow } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

const region = regions.SOUTH_WEST

test.describe('Two-part tariff review (internal)', { tag: '@sequential' }, () => {
  test.describe.configure({ mode: 'serial' })

  let billRunUrl
  let endYear
  let scenario
  let sessionCookies
  let startYear

  test.beforeAll(async ({ loginCookies, users, world }) => {
    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    scenario = world('licences-for-tpt-review')

    sessionCookies = await loginCookies(users.billingAndData)
  })

  test.beforeEach(async ({ context }) => {
    await context.addCookies(sessionCookies)
  })

  test.afterAll(async ({ logoutCookies }) => {
    await logoutCookies(sessionCookies)
  })

  test('creates a SROC two-part tariff bill run covering every review licence', async ({ page }) => {
    const { licence } = _reviewLicence(scenario, 13)
    const formattedCurrentDate = formatLongDate(new Date())

    await page.goto(`/system/licences/${licence.id}/summary`)

    // Confirm there are no flags already on the licence
    await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)
    await page.locator('#nav-bill-runs').click()

    await expect(page.locator('h1')).toContainText('Bill runs')
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    await expect(page.locator('h1')).toContainText('Select the bill run type')
    await page.getByRole('radio', { name: 'Two-part tariff', exact: true }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the region')
    await page.getByRole('radio', { name: region.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // The most recent year is the one the scenario seed data is set up for
    await expect(page.locator('h1')).toContainText('Select the financial year')
    await page.locator(`input[value="${endYear}"]`).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    // The bill run we created will be the top result. We expect its status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we look for the status REVIEW, and if not found reload the page and
    // try again. We then select it using the link on the date created
    await expect(page.locator('h1')).toContainText('Bill runs')
    await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'review')
    await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="region-0"]')).toContainText(region.displayName)
    await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
    await expect(page.locator('[data-test="bill-run-total-0"]')).toContainText('')
    await page.locator('[data-test="date-created-0"] > .govuk-link').click()

    await expect(page.locator('h1')).toContainText('Review licences')
    await expect(page.locator('.govuk-body > .govuk-tag')).toContainText('review')
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText(region.displayName)
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
    await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)
    await expect(page.locator('.govuk-table__caption')).toContainText(
      `Showing all ${scenario.licences.length} licences`
    )

    billRunUrl = page.url()
  })

  test(
    'navigates through all the review pages for a licence with two returns checking the matched returns and allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a single charge reference but two charge elements, only one of which is 2pt. It also has two returns, one 2pt and one not, fully allocated without issues.

**Acceptance Criteria**
- No issues are reported on the licence, the returns or the charging information.
- The return fully allocates to the charge element.`
      }
    },
    async ({ page }) => {
      const { billingAccount, company, licence, returnLogs } = _reviewLicence(scenario, 0)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef)

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )

      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')

      // Confirm there are no other returns
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial year ${startYear} to ${endYear}`
      )
      await expect(page.locator('#charge-version-0 > .govuk-heading-l')).toContainText(
        `Charge periods 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 1 two-part tariff charge element'
      )
      await expect(page.locator('.govuk-details__summary-text')).toContainText(
        `${company.name} billing account details`
      )
      await page.locator('.govuk-details__summary').click()
      await expect(page.locator('[data-test="billing-account"]')).toContainText(billingAccount.accountNumber)
      await expect(page.locator('[data-test="account-name"]')).toContainText(company.name)
      await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-version-0-charge-description-0"]')).toContainText(
        'High loss, non-tidal, up to and including 15 ML/yr'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 3.108 ML'
      )
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-0"]')).toContainText(
        'Element 1 of 1'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      // Confirm there is only one charge version, charge reference and charge element
      await expect(page.locator('#charge-version-1 > .govuk-heading-l')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-1"]')).toHaveCount(0)
      await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()
    }
  )

  test(
    'navigates through all the review pages for a licence with an aggregate checking the matched returns, the element issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. The charge reference has an aggregate value and it has one return that matches.

**Acceptance Criteria**
- The licence is flagged with the aggregate issue.
- The return still fully allocates to the charge element.
- The aggregate and charge adjustment factors can be amended on the charge reference.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 1)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Aggregate')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')
      await expect(page.locator('[data-test="matched-0-issue-0"]')).toHaveCount(0)

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Aggregate')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Aggregate')
      await page.getByRole('link', { name: 'Go back to review licence' }).click()

      // When an aggregate is present on the charge reference, this changes the reference link from "View details" to
      // "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText(
        'Change details'
      )
      await page.getByRole('link', { name: 'Change details' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial Year ${startYear} to ${endYear}`
      )
      await expect(page.locator('[data-test="charge-period"]')).toContainText(
        `Charge period 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="total-billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Aggregate factor (0.5 / 0.5)')
      await expect(page.locator('[data-test="adjustment-1"]')).toContainText('Charge adjustment (1 / 1)')
      await page.getByRole('link', { name: 'Change factors' }).click()

      await expect(page.locator('h1')).toContainText('Set the adjustment factors')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')
      await expect(page.locator('#amended-aggregate')).toHaveValue('0.5')
      await expect(page.locator('#amended-charge-adjustment')).toHaveValue('1')
      // Changing the aggregate factor to 1 removes it
      await page.locator('#amended-aggregate').fill('1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('#govuk-notification-banner-title')).toContainText('Adjustment updated')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Aggregate factor (1 / 0.5)')
      await expect(page.locator('.govuk-summary-list__actions > .govuk-link')).toContainText('Change factors')
      await page.getByRole('link', { name: 'Change factors' }).click()

      await expect(page.locator('h1')).toContainText('Set the adjustment factors')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')
      await expect(page.locator('#amended-aggregate')).toHaveValue('1')
      await expect(page.locator('#amended-charge-adjustment')).toHaveValue('1')
      await page.locator('#amended-charge-adjustment').fill('0.5')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('#govuk-notification-banner-title')).toContainText('Adjustment updated')
      await expect(page.locator('[data-test="adjustment-1"]')).toContainText('Charge adjustment (0.5 / 1)')
    }
  )

  test(
    'navigates through all the review pages for a licence with a late return checking the matched returns, the returns issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one return however this was received late.

**Acceptance Criteria**
- The licence is flagged with the returns received late issue.
- The return still fully allocates to the charge element.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 2)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['returns-late'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Returns received late')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Returns received late'
      )

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Returns received late'
      )
    }
  )

  test(
    'navigates through all the review pages for a licence with a nil return checking the matched returns and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one matching nil return.

**Acceptance Criteria**
- A nil return allocates nothing and raises no issues, so the licence is ready with no issues.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 3)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef)

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      // A nil return allocates nothing and raises no issues
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('0 ML / 0 ML')

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '0 ML / 1.554 ML'
      )
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`0 ML (${returnReference})`)

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('0 ML / 0 ML')
      await page.getByRole('link', { name: 'Go back to review licence' }).click()
    }
  )

  test(
    'navigates through all the review pages for a licence with no matching returns checking the charge information',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. Its only return is not two-part tariff, so the engine finds no matching returns.

**Acceptance Criteria**
- The licence is flagged with the unable to match return issue.
- With no matching returns the charge element's full authorised volume is billable.`
      }
    },
    async ({ page }) => {
      const { company, licence } = _reviewLicence(scenario, 4)

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['unable-to-match-return'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Unable to match return')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('h2.govuk-heading-m')).toContainText('No two-part tariff returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > div')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Unable to match return')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText('')
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Unable to match return')
      await expect(page.locator('[data-test="no-returns-message"]')).toContainText(
        'No matching two-part tariff returns'
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toHaveCount(0)
    }
  )

  test(
    'navigates through all the review pages for a licence with over-abstracted returns checking the matched returns and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and two charge elements. The return matching the first element is over-abstracted; the return matching the second is over-abstracted and abstracts outside the charge period.

**Acceptance Criteria**
- The licence is flagged with the over abstraction and abstraction outside period issues.
- An over-abstracted return still only allocates up to the lower of the charge element and charge reference volume, not the over-abstracted amount.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 5)
      // returnLogs is [previousFirst, currentFirst, previousSecond, currentSecond] - the two purposes' return
      // requirements are seeded with independent random references, so we can't assume which sorts first on the page
      const firstReturnReference = returnLogs[0].returnReference
      const secondReturnReference = returnLogs[2].returnReference

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['abs-outside-period', 'over-abstraction'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )

      // The two purposes' returns are seeded with independent random references, so look each row up by its known
      // reference rather than assuming which one the page lists first
      // First matched return is over-abstracted: 38 ML submitted but only the element's 32 ML allocates
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(
        tableRow(page, `${firstReturnReference}`).locator('[data-test^="matched-return-status-"] > .govuk-tag')
      ).toContainText('completed')
      await expect(
        tableRow(page, `${firstReturnReference}`).locator('[data-test^="matched-return-total-"]')
      ).toContainText('32 ML / 38 ML')
      await expect(
        tableRow(page, `${firstReturnReference}`).locator('[data-test^="matched-return-total-"]')
      ).toContainText('Over abstraction')

      // Second matched return is over-abstracted and abstracts outside its own abstraction period
      await expect(
        tableRow(page, `${secondReturnReference}`).locator('[data-test^="matched-return-status-"] > .govuk-tag')
      ).toContainText('completed')
      await expect(
        tableRow(page, `${secondReturnReference}`).locator('[data-test^="matched-return-total-"]')
      ).toContainText('30 ML / 36 ML')
      await expect(
        tableRow(page, `${secondReturnReference}`).locator('[data-test^="matched-return-total-"]')
      ).toContainText('Abstraction outside period')
      await expect(
        tableRow(page, `${secondReturnReference}`).locator('[data-test^="matched-return-total-"]')
      ).toContainText('Over abstraction')

      await expect(page.locator('[data-test="matched-return-action-2"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // One charge reference with two two-part tariff elements; both elements fully allocate (32 + 30 of the 64 volume)
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '62 ML / 64 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('32 ML / 32 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]')
      ).toContainText('30 ML / 30 ML')

      // First element's match details: 32 ML allocates of the 38 ML submitted, flagged over abstraction
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('32 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('32 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('32 ML / 38 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()

      // Second element's match details: 30 ML allocates of the 36 ML submitted, flagged abstraction outside period and
      // over abstraction
      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-1"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Storage')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('30 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('30 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('30 ML / 36 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Abstraction outside period'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Over abstraction'
      )
    }
  )

  test(
    'navigates through all the review pages for a licence with an overlap of charge dates checking the matched returns, the element issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one matching return with a submitted line straddling the charge period.

**Acceptance Criteria**
- The licence is flagged with the overlap of charge dates issue.
- The return still fully allocates to the charge element.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 6)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['returns-late'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['overlap-of-charge-dates'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Overlap of charge dates')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `15 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')
      await expect(page.locator('[data-test="matched-0-issue-0"]')).toHaveCount(0)

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Overlap of charge dates')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Overlap of charge dates')
      await page.getByRole('link', { name: 'Go back to review licence' }).click()
    }
  )

  test(
    'navigates through all the review pages for a licence with a received return checking the matched returns, the returns issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one matching return with a status of "received".

**Acceptance Criteria**
- The licence is flagged with the returns received but not processed issue.
- A received return is not allocated, so it is also flagged with the over abstraction issue.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 7)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['returns-received-not-processed'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('received')
      // A received return is not allocated, so it shows no allocated volume and is flagged as over abstracted
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('/')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Returns received but not processed'
      )

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '0 ML / 1.554 ML'
      )
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('received')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('/')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Returns received but not processed'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()
    }
  )

  test(
    'navigates through all the review pages for a licence with a return split over charge references checking the matched return, the return issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version that has two charge references, each with one charge element sharing the same purpose but a different abstraction period. Its single return matches both charge references.

**Acceptance Criteria**
- The licence is flagged with the return split over charge references issue.
- The return still fully allocates, split across the two charge references.`
      }
    },
    async ({ page }) => {
      const { company, licence } = _reviewLicence(scenario, 8)

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['return-split-over-refs'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Return split over charge references')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )

      // A single matched return, flagged as split over charge references, that still fully allocates (24 ML of 24 ML)
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // Two charge references, each with one element; the return's 24 ML is split 10 ML / 14 ML across them. The
      // references have different charge categories and sort by subsistence charge (highest first), so 4.6.19 is shown
      // before 4.6.1.
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '2 charge references with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.6.19')
      await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '10 ML / 32 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('10 ML / 10 ML')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-1"]')).toContainText(
        '14 ML / 32 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-billable-returns-0"]')
      ).toContainText('14 ML / 14 ML')

      // First element's match details: 10 ML of the return allocates to it, still flagged split over charge references
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('10 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('10 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()

      // Second element's match details: the other 14 ML of the return allocates to it
      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('14 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('14 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
    }
  )

  test(
    'navigates through all the review pages for a licence with a return straddling two charge elements checking the matched return and the over-authorised warning',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and two charge elements covering different parts of the year. Its only return is two-part tariff and its volume straddles both elements, fully allocating to each.

**Acceptance Criteria**
- The return fully allocates across both charge elements, so the licence is ready with no issues.
- Reducing the charge reference's authorised volume below the sum of the allocated elements shows the over-authorised warning.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 9)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef)

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toBeEmpty()
      await expect(page.locator('[data-test="licence-progress-1"]')).toBeEmpty()
      // The return fully allocates across both elements, so the licence has no issues and is ready to bill
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-0-issue-0"]')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText(
        'Change details'
      )

      // First element ~ April to October, filled to its authorised 0.9065 ML
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
        `1 April ${startYear} to 31 October ${startYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toBeEmpty()
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0.9065 ML / 0.9065 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      // Second element ~ November to March, filled to its authorised 0.6475 ML
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-1"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-1"]')).toContainText(
        `1 November ${startYear} to 31 March ${endYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-1"]')
      ).toBeEmpty()
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]')
      ).toContainText('0.6475 ML / 0.6475 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-1"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      // Drive the over-authorised warning: drop the first element's billable returns, reduce the reference's authorised
      // volume below the combined element volume, then restore the element so the elements together exceed the reference
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await page.getByRole('button', { name: 'Edit the billable returns' }).click()

      await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
      await page.locator('#custom-quantity-selector').check()
      await page.locator('#custom-quantity').fill('0.1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('[data-test="billable-returns"]')).toContainText('0.1 ML')
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()

      await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.6.1')
      await page.getByRole('button', { name: 'Change the authorised volume' }).click()

      await expect(page.locator('h1')).toContainText('Set the authorised volume')
      await page.locator('#amended-authorised-volume').fill('1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1 ML')
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await page.getByRole('button', { name: 'Edit the billable returns' }).click()

      await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
      await page.locator('#authorised-quantity').check()
      await page.getByRole('button', { name: 'Confirm' }).click()
      await page.locator('.govuk-back-link').click()

      // With both elements back at their authorised volumes they now exceed the reference's reduced authorised volume
      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('.govuk-warning-text__icon')).toBeVisible()
      await expect(page.locator('.govuk-warning-text__text')).toContainText(
        'The total billable return volume exceeds the total authorised volume'
      )
    }
  )

  test(
    'navigates through all the review pages for a licence with a return under query checking the matched returns, the returns issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one matching return which is under query.

**Acceptance Criteria**
- The licence is flagged with the checking query issue.
- A return under query is not allocated, so it is also flagged with the over abstraction issue.`
      }
    },
    async ({ page }) => {
      const { company, licence, returnLogs } = _reviewLicence(scenario, 10)
      const { returnReference } = returnLogs[0]

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['checking-query'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('query')
      // A return under query is not allocated, so it shows no allocated volume and is flagged as over abstracted
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('0 ML / 1.554 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText('Checking query')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Over abstraction'
      )

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '0 ML / 1.554 ML'
      )
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('query')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '0 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText('Checking query')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Over abstraction'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()
    }
  )

  test(
    'navigates through all the review pages for a licence with two charge references checking the matched returns, the returns issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version that has two charge references, each with one charge element. Both elements have a matching return with a status of "due".

**Acceptance Criteria**
- The licence is flagged with the "No returns received" issue.
- The engine allocates only up to the lower of the charge reference volume and the charge element's authorised volume, proven by swapping which is lower between the two references.`
      }
    },
    async ({ page }) => {
      const { company, licence } = _reviewLicence(scenario, 11)

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['no-returns-received'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('No returns received')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )

      // Two matched returns, both due (overdue) and flagged as no returns received
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('overdue')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'No returns received'
      )
      await expect(page.locator('[data-test="matched-return-status-1"] > .govuk-tag')).toContainText('overdue')
      await expect(page.locator('[data-test="matched-return-total-1"] > :nth-child(2)')).toContainText(
        'No returns received'
      )
      await expect(page.locator('[data-test="matched-return-action-2"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // Two charge references, each with one element, sharing the same two volumes (22 and 42) with the reference and
      // element swapped. The first reference (22) is lower than its element (42) so allocation caps at the reference;
      // the second element (22) is lower than its reference (42) so allocation caps at the element. Both allocate 22.
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '2 charge references with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '22 ML / 22 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('22 ML / 42 ML')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-1"]')).toContainText(
        '22 ML / 42 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-billable-returns-0"]')
      ).toContainText('22 ML / 22 ML')
    }
  )

  test(
    'navigates through all the review pages for a licence with an unmatched return checking the unmatched return, the return issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and one charge element. Its only return is two-part tariff but has a different purpose to the charge element, so the engine cannot match it.

**Acceptance Criteria**
- The charge element is flagged unable to match a return and the unmatched return is flagged over abstraction, so the licence has multiple issues.
- With no matching return the charge element's full authorised volume is billable and the unmatched return allocates nothing.`
      }
    },
    async ({ page }) => {
      const { company, licence } = _reviewLicence(scenario, 12)

      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['aggregate-factor'])
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await _filterReviewLicences(page, billRunUrl, licence.licenceRef, ['unable-to-match-return'])
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toBeEmpty()
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )

      // The return is two-part tariff but its purpose differs from the element, so it sits in the unmatched returns
      // table, over-abstracted with nothing allocated
      await expect(page.locator('.govuk-table__caption')).toContainText('Unmatched returns')
      await expect(page.locator('[data-test="unmatched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Storage'
      )
      await expect(page.locator('[data-test="unmatched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="unmatched-return-total-0"] > :nth-child(1)')).toContainText(
        '0 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="unmatched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="unmatched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // The charge element has no matching return, so it is flagged unable to match and bills its full authorised volume
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 1 two-part tariff charge element'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Unable to match return')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toBeEmpty()

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Unable to match return')
      await expect(page.locator('[data-test="no-returns-message"]')).toContainText(
        'No matching two-part tariff returns'
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toHaveCount(0)
    }
  )

  test(
    'navigates through all the review pages for a licence with no issues, changing the billable returns volume, previewing the charge, marking the licence as review, marking progress and finally removing the licence from the bill run',
    {
      tag: '@supplementary-billing',
      annotation: {
        type: 'tpt-review',
        description: `The simplest test case with a single charge element and matching return, fully allocated without issues.

**Acceptance Criteria**
- No issues are reported on the licence, the returns or the charging information.
- The return fully allocates to the charge element.`
      }
    },
    async ({ page }) => {
      const { billingAccount, company, licence, returnLogs } = _reviewLicence(scenario, 13)
      const { returnReference } = returnLogs[0]
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto(billRunUrl)

      await expect(page.locator('h1')).toContainText('Review licences')
      await page.locator('.govuk-details__summary').click()
      await page.locator('#licenceHolderNumber').fill('AT/1')
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await page.locator('.govuk-details__summary').click()
      await page.locator('#licenceHolderNumber').fill(licence.licenceRef)
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await page.locator('.govuk-details__summary').click()
      await page.locator('#licenceHolderNumber').fill('Miss A Test')
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await page.locator('.govuk-details__summary').click()
      await page.locator('#licenceHolderNumber').fill(company.name)
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText(company.name)
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText(company.name)
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        `${region.displayName} two-part tariff`
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('[data-test="summary-link"]')).toBeVisible()
      await expect(page.locator('[data-test="returns-link"]')).toBeVisible()
      await expect(page.locator('[data-test="charge-information-link"]')).toBeVisible()
      await expect(page.locator('[data-test="charge-period-0"]')).toBeVisible()
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toBeVisible()

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial year ${startYear} to ${endYear}`
      )
      await expect(page.locator('#charge-version-0 > .govuk-heading-l')).toContainText(
        `Charge periods 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 1 two-part tariff charge element'
      )
      await expect(page.locator('.govuk-details__summary-text')).toContainText(
        `${company.name} billing account details`
      )
      await page.locator('.govuk-details__summary').click()
      await expect(page.locator('[data-test="billing-account"]')).toContainText(billingAccount.accountNumber)
      await expect(page.locator('[data-test="account-name"]')).toContainText(company.name)
      await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-version-0-charge-description-0"]')).toContainText(
        'High loss, non-tidal, up to and including 15 ML/yr'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-0"]')).toContainText(
        'Element 1 of 1'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText(`1.554 ML (${returnReference})`)

      await expect(page.locator('#charge-version-1 > .govuk-heading-l')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-1"]')).toHaveCount(0)
      await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-reference-description"]')).toContainText(
        'High loss, non-tidal, up to and including 15 ML/yr'
      )
      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial Year ${startYear} to ${endYear}`
      )
      await expect(page.locator('[data-test="charge-period"]')).toContainText(
        `Charge period 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="total-billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')

      await page.locator('.govuk-button').click()
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
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
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="issues-0"]')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText(
        `${returnReference}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )

      await page.locator('.govuk-button').click()
      await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
      await expect(page.locator('.govuk-caption-l')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-period-0"]')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial year ${startYear} to ${endYear}`
      )
      await expect(page.locator('[data-test="charge-period"]')).toContainText(
        `Charge period 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="authorised-quantity"]')).toContainText('Authorised 1.554ML')
      await page.locator('#custom-quantity-selector').check()
      await page.locator('#custom-quantity').fill('1')
      await page.locator('.govuk-button').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
        'The billable returns for this licence have been updated'
      )
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('1 ML')
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1 ML / 1.554 ML')

      await page.getByText('Put licence into review').click()
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Licence changed to review.')
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator('.govuk-button--primary')).toContainText('Confirm licence is ready')

      await page.getByText('Mark progress').click()
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('.govuk-notification-banner__heading')).toContainText('This licence has been marked.')
      await expect(page.locator('button.govuk-button--secondary')).toContainText('Remove progress mark')

      await page.getByText('Remove from bill run').click()
      await expect(page.locator('h1')).toContainText(`You're about to remove ${licence.licenceRef} from the bill run`)
      await expect(page.locator('.govuk-inset-text')).toContainText(
        'The licence will go into the next two-part tariff supplementary bill run.'
      )
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(region.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)
      await page.locator('.govuk-button').click()

      await expect(page.locator('h1')).toContainText('Review licences')
      await expect(page.locator('#govuk-notification-banner-title')).toContainText('Licence removed')
      await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
        `Licence ${licence.licenceRef} removed from the bill run.`
      )
      await expect(page.locator('#main-content')).toContainText('No licences found')

      await page.locator('#nav-search').click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row', { hasText: licence.licenceRef }).getByRole('link').click()

      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next two-part tariff supplementary bill run.'
      )
    }
  )
})

/**
 * Opens the bill run's review licences page and filters it to a single licence, plus any issues to filter on
 *
 * @private
 */
async function _filterReviewLicences(page, billRunUrl, licenceRef, issues = []) {
  await page.goto(billRunUrl)

  await expect(page.locator('h1')).toContainText('Review licences')
  await page.locator('.govuk-details__summary').click()
  await page.locator('#licenceHolderNumber').fill(licenceRef)

  for (const issue of issues) {
    await page.locator(`[data-test="${issue}"]`).check()
  }

  await page.getByRole('button', { name: 'Apply filters' }).click()
}

/**
 * Picks out one review licence's data from the merged scenario by its build position, with only its own return logs
 *
 * @private
 */
function _reviewLicence(scenario, index) {
  const licence = scenario.licences[index]

  return {
    billingAccount: scenario.billingAccounts[index],
    company: scenario.companies[index],
    licence,
    returnLogs: scenario.returnLogs.filter((returnLog) => {
      return returnLog.licenceRef === licence.licenceRef
    })
  }
}
