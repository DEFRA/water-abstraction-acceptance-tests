import scenarioData from '../../support/scenarios/unregistered-licence-with-presroc-charge-version.scenario.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

/**
 * Uses a different combination of choices to add-charge-reference.spec.js (no note, a single element from
 * abstraction data, no additional charges, a different adjustment type) that flags the licence for both the
 * two-part tariff supplementary bill run and the standard supplementary bill run, not just the standard one.
 *
 * Lives in supplementary-billing-flags rather than charge-information because it tests the flagging outcome, not
 * the wizard journey itself.
 */
test.describe('Approving a charge version (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new charge information with a new billing account, note and charge element then sets up the charge reference including additional charges and adjustments and then approves it and confirms licence is flagged for supplementary billing', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // Confirm we are on the tab page and then click Set up a new charge
    await expect(page.getByText('Charge information').first()).toBeVisible()
    await page.getByText('Set up a new charge').click()

    // Select reason for new charge information
    // choose Change to charge scheme and continue
    await page.locator('input#reason-3').click()
    await page.locator('form > .govuk-button').click()

    // Set charge start date
    // choose another date and then enter 2022-06-01 and continue
    await page.locator('input#startDate-4').click()
    await page.locator('#customDate-day').fill('1')
    await page.locator('#customDate-month').fill('6')
    await page.locator('#customDate-year').fill('2022')
    await page.locator('form > .govuk-button').click()

    // Who should the bills go to?
    // the existing account is automatically selected so just continue
    await page.locator('form > .govuk-button').click()

    // Select an existing address for Big Farm Co Ltd
    // choose the existing address and continue
    await page.locator('input#selectedAddress').click()
    await page.locator('form > .govuk-button').click()

    // Do you need to add an FAO?
    // choose No and continue
    await page.locator('input#faoRequired-2').click()
    await page.locator('form > .govuk-button').click()

    // Check billing account details
    // confirm
    await page.locator('form > .govuk-button').filter({ hasText: 'Confirm' }).click()

    // Use abstraction data to set up the element?
    // choose Use charge information valid from 1 June 2022 and continue
    await page.locator('input#useAbstractionData-4').click()
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // set the charge reference
    await page.locator('button[value="addChargeCategory"]').click()

    // Enter a description for the charge reference
    // enter a description and continue
    await page.locator('#description').fill('Automation-Test')
    await page.locator('form > .govuk-button').click()

    // Select the source
    // choose non-tidal and continue
    await page.locator('input#source-2').click()
    await page.locator('form > .govuk-button').click()

    // Select the loss category
    // choose low and continue
    await page.locator('input#loss-3').click()
    await page.locator('form > .govuk-button').click()

    // Enter the total quantity to use for this charge reference
    // enter 150 and continue
    await page.locator('#volume').fill('150')
    await page.locator('form > .govuk-button').click()

    // Select the water availability
    // choose Restricted availability or no availability and continue
    await page.locator('input#isRestrictedSource-2').click()
    await page.locator('form > .govuk-button').click()

    // Select the water modelling charge
    // choose Tier 1 and continue
    await page.locator('input#waterModel-2').click()
    await page.locator('form > .govuk-button').click()

    // Do additional charges apply?
    // choose No and continue
    await page.locator('#isAdditionalCharges-2').click()
    await page.locator('form > .govuk-button').click()

    // Do adjustments apply?
    // choose Yes and continue
    await page.locator('input#isAdjustments').click()
    await page.locator('form > .govuk-button').click()

    // Which adjustments apply?
    // choose Charge adjustment, enter a Factor and continue
    await page.locator('#adjustments-4').click()
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // confirm
    await page.locator('form > .govuk-button').filter({ hasText: 'Confirm' }).click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    await expect(page.locator('.govuk-panel__title')).toContainText('Charge information complete')
    await page.locator('a[href*="licences/"]').filter({ hasText: 'View charge information' }).click()

    // Charge information
    // select to review it
    await page.locator('[data-test="review-charge-version-0"]').click()

    // Check charge information
    // approve the new charge version
    await expect(page.locator('strong.govuk-tag--orange')).toContainText('Review')
    await page.locator('input#reviewOutcome').click()
    await page.locator('form > .govuk-button').filter({ hasText: 'Continue' }).click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    await expect(page.locator('[data-test="review-charge-version-0"]')).toHaveCount(0)

    // Navigate to back to the Licence summary page
    await page.locator('nav a').filter({ hasText: 'Licence summary' }).click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run.'
    )
  })
})
