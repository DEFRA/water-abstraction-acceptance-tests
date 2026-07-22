import scenarioData from '../../support/scenarios/licence-with-presroc-charge-version.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('SROC charge information journey (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new charge information with a new billing account, note and charge element then sets up the charge reference including additional charges and adjustments and then approves it and confirms licence is flagged for supplementary billing', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // Confirm we are on the licence set-up page and then click Set up a new charge
    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up a new charge').click()

    // Select reason for new charge information
    // choose Change to charge scheme and continue
    await page.locator('input#reason-3').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set charge start date
    // choose another date and then enter 2022-06-01 and continue
    await page.locator('input#startDate-4').click()
    await page.locator('#customDate-day').fill('1')
    await page.locator('#customDate-month').fill('6')
    await page.locator('#customDate-year').fill('2022')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select an existing billing account for Big Farm Co Ltd
    // choose the existing account and continue
    await page.locator('input#billingAccountId').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Use abstraction data to set up the element?
    // choose Use charge information valid from 1 January 2018 and continue
    await page.getByRole('radio', { name: 'Use charge information valid from 1 January 2018' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check charge information
    // add a note
    await page.locator('section:nth-child(2) > p > a').click()

    // Add a note
    // enter a note and continue
    await page.locator('#note').fill('This is Automation Testing')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check charge information
    // add another element
    await page.locator('button[value="addElement"]', { hasText: 'Add another element' }).click()

    // Select a purpose use
    // choose the one option available Animal Watering & General Use In Non Farming Situations and continue
    await page.locator('input#purpose').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Add element description
    // enter a description and continue
    await page.locator('input#description').fill('test element description')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set abstraction period
    // enter start and end date and continue
    await page.locator('input#startDate-day').fill('1')
    await page.locator('input#startDate-month').fill('4')
    await page.locator('input#endDate-day').fill('30')
    await page.locator('input#endDate-month').fill('9')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Add annual quantities
    // enter annual quantity and continue
    await page.locator('input#authorisedAnnualQuantity').fill('10')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set time limit?
    // choose no and continue
    await page.locator('input#timeLimitedPeriod-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select loss category
    // choose medium and continue
    await page.locator('input#loss-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Should two-part tariff agreements apply to this element?
    // Yes is selected by default so just continue
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check charge information
    // set the charge reference
    await page.locator('button[value="addChargeCategory"]').click()

    // Select the elements this charge reference is for
    // tick both and continue
    await page.locator('input#selectedElementIds').check()
    await page.locator('input#selectedElementIds-2').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a description for the charge reference
    // enter a description and continue
    await page.locator('#description').fill('Automation-Test')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the source
    // choose non-tidal and continue
    await page.locator('input#source-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the loss category
    // choose low and continue
    await page.locator('input#loss-3').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter the total quantity to use for this charge reference
    // enter 150 and continue
    await page.locator('#volume').fill('150')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the water availability
    // choose Restricted availability or no availability and continue
    await page.locator('input#isRestrictedSource-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the water modelling charge
    // choose Tier 1 and continue
    await page.locator('input#waterModel-2').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Do additional charges apply?
    // choose Yes and continue
    await page.locator('input#isAdditionalCharges').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Is abstraction from a supported source?
    // choose Yes and continue
    await page.locator('input#isSupportedSource').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the name of the supported source
    // choose Rhee Groundwater and continue
    await page.locator('input#supportedSourceId-12').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Do adjustments apply?
    // choose Yes and continue
    await page.locator('input#isAdjustments').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Which adjustments apply?
    // choose Charge adjustment, enter a Factor and continue
    await page.locator('input#adjustments-2').check()
    await page.locator('#chargeFactor').fill('25')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check charge information
    // confirm
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    await expect(page.locator('.govuk-panel__title')).toContainText('Charge information complete')
    await page.locator('a[href*="licences/"]', { hasText: 'View charge information' }).click()

    // Charge information
    // select to review it
    await page.locator('[data-test="review-charge-version-0"]').click()

    // Check charge information
    // approve the new charge version
    await expect(page.locator('strong.govuk-tag--orange')).toContainText('Review')
    await page.locator('input#reviewOutcome').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    await expect(page.getByText('Review')).toHaveCount(0)

    // Navigate to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run.'
    )
  })
})
