import scenarioData from '../../../support/scenarios/unregistered-licence-with-presroc-charge-version.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

/**
 * Walks the same charge information wizard as add-charge-reference.spec.js, but focuses on field-level
 * validation - empty submissions, invalid characters and out-of-range values - rather than the happy path.
 */
test.describe('SROC charge information validation (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new charge information with a new billing account and a note, and sets up the charge reference including additional charges and adjustments', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // Confirm we are on the licence set-up page and then click Set up a new charge
    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up a new charge').click()

    // Select reason for new charge information
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Select a reason for new charge information')
    await expect(page.locator('.govuk-error-message')).toContainText('Select a reason for new charge information')
    // choose Change to charge scheme and continue
    await page.locator('input#reason-3').click()
    await page.locator('form > .govuk-button').click()

    // Set charge start date
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Select charge information start date')
    await expect(page.locator('.govuk-error-message')).toContainText('Select charge information start date')
    // choose another date
    await page.locator('input#startDate-4').click()
    // test date before licence start date
    await page.locator('#customDate-day').fill('1')
    await page.locator('#customDate-month').fill('6')
    await page.locator('#customDate-year').fill('2017')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Date must be after the start date of the earliest known licence version'
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      'Date must be after the start date of the earliest known licence version'
    )
    // test not a real date
    await page.locator('#customDate-day').fill('aa')
    await page.locator('#customDate-month').fill('6')
    await page.locator('#customDate-year').fill('2022')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Enter a real date for the charge information start date'
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      'Enter a real date for the charge information start date'
    )
    // enter 2022-06-01 and continue
    await page.locator('#customDate-day').fill('1')
    await page.locator('#customDate-month').fill('6')
    await page.locator('#customDate-year').fill('2022')
    await page.locator('form > .govuk-button').click()

    // Who should the bills go to?
    // the existing account is automatically selected so just continue
    await page.locator('form > .govuk-button').click()

    // Select an existing address for Big Farm Co Ltd
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Select an existing address, or set up a new one.'
    )
    await expect(page.locator('.govuk-error-message')).toContainText('Select an existing address, or set up a new one.')
    // choose the existing address and continue
    await page.locator('input#selectedAddress').click()
    await page.locator('form > .govuk-button').click()

    // Do you need to add an FAO?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Select yes if you need to add a person or department as an FAO'
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      'Select yes if you need to add a person or department as an FAO'
    )
    // choose No and continue
    await page.locator('input#faoRequired-2').click()
    await page.locator('form > .govuk-button').click()

    // Check billing account details
    // check the details are as expected and confirm
    const billingAccountDetails = page.locator('section > dl')
    await expect(billingAccountDetails.locator('div:nth-child(1) > dd.govuk-summary-list__value')).toContainText(
      'Big Farm Co Ltd'
    )
    await expect(billingAccountDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText(
      'TT1 1TT'
    )
    await expect(billingAccountDetails.locator('div:nth-child(3) > dd.govuk-summary-list__value')).toContainText('No')
    await page.locator('form > .govuk-button').click()

    // Use abstraction data to set up the element?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Select whether to use abstraction data to set up the element'
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      'Select whether to use abstraction data to set up the element'
    )
    // choose Use charge information valid from 1 June 2022 and continue
    await page.locator('input#useAbstractionData-4').click()
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // check the charge details and element details are as expected and then select option to add a note
    const chargeDetails = page.locator('section:nth-child(1) > dl')
    await expect(chargeDetails.locator('div:nth-child(1) > dd.govuk-summary-list__value')).toContainText(
      'Change to charge scheme'
    )
    await expect(chargeDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText('1 June 2022')
    await expect(chargeDetails.locator('div:nth-child(3) > dd.govuk-summary-list__value')).toContainText('Big Farm')
    await expect(chargeDetails.locator('div:nth-child(4) > dd.govuk-summary-list__value')).toContainText(
      'Big Farm Co Ltd'
    )
    await expect(page.locator('form > section > h2')).toContainText('Element')
    const elementDetails = page.locator('form > section > dl')
    await expect(elementDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText(
      'Test Charge Element!'
    )
    await expect(elementDetails.locator('div:nth-child(3) > dd.govuk-summary-list__value')).toContainText(
      '1 April to 31 March'
    )
    await expect(elementDetails.locator('div:nth-child(4) > dd.govuk-summary-list__value')).toContainText(
      '15.54ML authorised'
    )
    await expect(elementDetails.locator('div:nth-child(5) > dd.govuk-summary-list__value')).toContainText('No')
    await expect(elementDetails.locator('div:nth-child(6) > dd.govuk-summary-list__value')).toContainText('Medium')
    await page.locator('section:nth-child(2) > p > a').click()

    // Add a note
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Enter details.')
    await expect(page.locator('.govuk-error-message')).toContainText('Enter details.')
    // enter a note and continue
    await page.locator('#note').fill('This is Automation Testing')
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // back on this page we confirm the note we added is present then set the charge reference
    const noteDetails = page.locator('#main-content > :nth-child(1) > :nth-child(2) > :nth-child(2)')
    await expect(noteDetails.locator('dt')).toContainText('billing.data@wrls.gov.uk')
    await expect(noteDetails.locator('dd.govuk-summary-list__value')).toContainText('This is Automation Testing')
    await page.locator('button[value="addChargeCategory"]').click()

    // Enter a description for the charge reference
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Enter a description for the charge reference'
    )
    await expect(page.locator('.govuk-error-message')).toContainText('Enter a description for the charge reference')
    // test submitting invalid characters. We loop through testing each one
    const invalidDescriptionCharacters = ['“', '”', '?', '^', '£', '≥', '≤', '—']
    for (const character of invalidDescriptionCharacters) {
      await page.locator('#description').fill(character)
      await page.locator('form > .govuk-button').click()
      await expect(page.locator('.govuk-error-summary__list')).toContainText(
        'You can not use “ ” ? ^ £ ≥ ≤ — (long dash) in the charge reference description'
      )
      await expect(page.locator('.govuk-error-message')).toContainText(
        'You can not use “ ” ? ^ £ ≥ ≤ — (long dash) in the charge reference description'
      )
    }
    // enter a description made up of valid special characters and continue
    await page.locator('#description').fill("-'.,()&* are supported characters")
    await page.locator('form > .govuk-button').click()

    // Select the source
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Select if the source is tidal or non-tidal.'
    )
    await expect(page.locator('.govuk-error-message')).toContainText('Select if the source is tidal or non-tidal.')
    // select non-tidal and continue
    await page.locator('input#source-2').click()
    await page.locator('form > .govuk-button').click()

    // Select the loss category
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      'Select if the loss category is high, medium or low.'
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      'Select if the loss category is high, medium or low.'
    )
    // select low and continue
    await page.locator('input#loss-3').click()
    await page.locator('form > .govuk-button').click()

    // Enter the total quantity to use for this charge reference
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Enter the volume in ML (megalitres).')
    await expect(page.locator('.govuk-error-message')).toContainText('Enter the volume in ML (megalitres).')
    // test submitting not a real number
    await page.locator('#volume').fill('1a')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Enter the volume in ML (megalitres).')
    await expect(page.locator('.govuk-error-message')).toContainText('Enter the volume in ML (megalitres).')
    // test submitting -1
    await page.locator('#volume').fill('-1')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('The volume must be greater than 0')
    await expect(page.locator('.govuk-error-message')).toContainText('The volume must be greater than 0')
    // test submitting 0
    await page.locator('#volume').fill('0')
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('The volume must be greater than 0')
    await expect(page.locator('.govuk-error-message')).toContainText('The volume must be greater than 0')
    // enter 0.5 to confirm decimal numbers are allowed and continue
    await page.locator('#volume').fill('0.5')
    await page.locator('form > .govuk-button').click()

    // Select the water availability
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Select the water availability.')
    await expect(page.locator('.govuk-error-message')).toContainText('Select the water availability.')
    // choose Restricted availability or no availability and continue
    await page.locator('input#isRestrictedSource-2').click()
    await page.locator('form > .govuk-button').click()

    // Select the water modelling charge
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Select the water modelling charge.')
    await expect(page.locator('.govuk-error-message')).toContainText('Select the water modelling charge.')
    // choose Tier 1 and continue
    await page.locator('input#waterModel-2').click()
    await page.locator('form > .govuk-button').click()

    // Do additional charges apply?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText("Select 'yes' if additional charges apply.")
    await expect(page.locator('.govuk-error-message')).toContainText("Select 'yes' if additional charges apply.")
    // choose Yes and continue
    await page.locator('input#isAdditionalCharges').click()
    await page.locator('form > .govuk-button').click()

    // Is abstraction from a supported source?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      "Select 'yes' if abstraction is from a supported source."
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      "Select 'yes' if abstraction is from a supported source."
    )
    // choose Yes and continue
    await page.locator('input#isSupportedSource').click()
    await page.locator('form > .govuk-button').click()

    // Select the name of the supported source
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('Select the name of the supported source.')
    await expect(page.locator('.govuk-error-message')).toContainText('Select the name of the supported source.')
    // choose Rhee Groundwater and continue
    await page.locator('input#supportedSourceId-12').click()
    await page.locator('form > .govuk-button').click()

    // Is abstraction for the supply of public water?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      "Select 'yes' if abstraction is for the supply of public water."
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      "Select 'yes' if abstraction is for the supply of public water."
    )
    // choose Yes and continue
    await page.locator('input#isSupplyPublicWater').click()
    await page.locator('form > .govuk-button').click()

    // Do adjustments apply?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText("Select 'yes' if adjustments apply.")
    await expect(page.locator('.govuk-error-message')).toContainText("Select 'yes' if adjustments apply.")
    // choose Yes and continue
    await page.locator('input#isAdjustments').click()
    await page.locator('form > .govuk-button').click()

    // Which adjustments apply?
    // test submitting nothing
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText('At least one condition must be selected')
    await expect(page.locator('.govuk-error-message')).toContainText('At least one condition must be selected')
    // choose Charge Adjustment
    await page.locator('input#adjustments-2').check()
    // test not submitting a factor
    await page.locator('form > .govuk-button').click()
    await expect(page.locator('.govuk-error-summary__list')).toContainText(
      "The 'Charge adjustment' factor must not have more than 15 decimal places."
    )
    await expect(page.locator('.govuk-error-message')).toContainText(
      "The 'Charge adjustment' factor must not have more than 15 decimal places."
    )
    // choose Charge adjustment, enter a Factor and continue
    await page.locator('#chargeFactor').fill('25')
    await page.locator('form > .govuk-button').click()

    // Check charge information
    // back on the check charge information screen there is now new sections covering the charge reference. We confirm
    // they exist and the details match what we entered and then confirm
    const chargeReferenceForm = page.locator(':nth-child(1) > .govuk-grid-column-full > form')
    await expect(chargeReferenceForm.locator('h2.govuk-heading-l > span')).toContainText('Charge reference 4.4.5')
    await expect(chargeReferenceForm.locator('h2:nth-child(4)')).toContainText('Charge reference details')

    const chargeReferenceDetails = chargeReferenceForm.locator('dl:nth-child(5)')
    await expect(chargeReferenceDetails.locator('div:nth-child(1) > dd.govuk-summary-list__value')).toContainText(
      'Test Charge Element!'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText(
      'are supported characters'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(3) > dd.govuk-summary-list__value')).toContainText(
      'Non-tidal'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(4) > dd.govuk-summary-list__value')).toContainText('Low')
    await expect(chargeReferenceDetails.locator('div:nth-child(5) > dd.govuk-summary-list__value')).toContainText(
      '0.5ML'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(6) > dd.govuk-summary-list__value')).toContainText(
      'Restricted availablity'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(7) > dd.govuk-summary-list__value')).toContainText(
      'Tier 1'
    )
    await expect(chargeReferenceDetails.locator('div:nth-child(8) > dd.govuk-summary-list__value')).toContainText('Yes')
    await expect(chargeReferenceDetails.locator('div:nth-child(9) > dd.govuk-summary-list__value')).toContainText('Yes')
    await expect(chargeReferenceDetails.locator('div:nth-child(10) > dd.govuk-summary-list__value')).toContainText(
      'Southern'
    )

    await expect(chargeReferenceForm.locator('h2:nth-child(7)')).toContainText('Additional charges')
    const additionalChargesDetails = chargeReferenceForm.locator('dl:nth-child(8)')
    await expect(additionalChargesDetails.locator('div:nth-child(1) > dd.govuk-summary-list__value')).toContainText(
      'Yes'
    )
    await expect(additionalChargesDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText(
      'Rhee Groundwater'
    )
    await expect(additionalChargesDetails.locator('div:nth-child(3) > dd.govuk-summary-list__value')).toContainText(
      'Yes'
    )

    const adjustmentsDetails = chargeReferenceForm.locator('dl:nth-child(10)')
    await expect(adjustmentsDetails.locator('div:nth-child(1) > dt')).toContainText('Adjustments')
    await expect(adjustmentsDetails.locator('div:nth-child(2) > dd.govuk-summary-list__value')).toContainText('25')

    await page.locator('form > .govuk-button').filter({ hasText: 'Confirm' }).click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    await expect(page.locator('.govuk-panel__title')).toContainText('Charge information complete')
    await page.locator('a[href*="licences/"]').filter({ hasText: 'View charge information' }).click()

    // Charge information
    // confirm our new charge information is in REVIEW
    await expect(page.locator('[data-test="review-charge-version-0"]')).toBeVisible()
  })
})
