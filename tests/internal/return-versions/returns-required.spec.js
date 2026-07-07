import scenarioData from '../../support/scenarios/two-return-requirements-with-points.scenario.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

test.describe('Submit returns requirement (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return requirement and approves the requirement', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // choose the licence version start date and click continue
    await page.locator('#licenceStartDate').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the reason page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    await page.locator('#changeToSpecialAgreement').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'How do you want to set up the requirements for returns?'
    )

    // click set up manually and continue
    await page.locator('#setUpManually').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the purpose page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the purpose for the requirements for returns')

    // choose a purpose and add a purpose description for the requirement and continue
    await page.locator('[data-test="purpose-0"]').check()
    await page.locator('[data-test="purpose-alias-0"]').fill('This is a purpose description')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the points page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    await page.locator('#points').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the abstraction period page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Enter the abstraction period for the requirements for returns'
    )

    // enter start and end dates for the abstraction period and click continue
    await page.locator('#abstractionPeriodStartDay').fill('01')
    await page.locator('#abstractionPeriodStartMonth').fill('12')
    await page.locator('#abstractionPeriodEndDay').fill('03')
    await page.locator('#abstractionPeriodEndMonth').fill('09')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Select the returns cycle for the requirements for returns'
    )

    // choose a returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the site description page
    await expect(page.locator('h1')).toHaveText('Enter a site description for the requirements for returns')

    // enter a site description and continue
    await page.locator('#siteDescription').fill('This is a valid site description')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings collected page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    await page.locator('#frequencyCollectedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings reported page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    await page.locator('#frequencyReportedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the agreements and exceptions page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Select agreements and exceptions for the requirements for returns'
    )

    // choose an agreement and exception and continue
    await page.locator('#gravityFill').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the start date information we expect
    await expect(page.locator('[data-test="start-date"]')).toContainText('1 January 2018')

    // choose the change option for the start date
    await page.locator('[data-test="change-start-date"]').click()

    // change start date and continue
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('02')
    await page.locator('#startDateMonth').fill('08')
    await page.locator('#startDateYear').fill('2023')
    await page.locator('form > .govuk-button').click()

    // confirm we are back on check page and see the start date changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="start-date"]')).toContainText('2 August 2023')

    // confirm we see the reason we selected
    await expect(page.locator('[data-test="reason"]')).toContainText('Change to special agreement')

    // choose the change option for reason
    await page.locator('[data-test="change-reason"]').click()

    // change the reason and continue
    await page.locator('#minorChange').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the reason changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="reason"]')).toContainText('Minor change')

    // confirm we see the purposes selected
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(
      'General Farming & Domestic (This is a purpose description)'
    )

    // choose the change option for purposes
    await page.locator('[data-test="change-purposes-0"]').click()

    // change the purpose and purpose description and click continue
    await page.locator('[data-test="purpose-0"]').uncheck()
    await page.locator('[data-test="purpose-1"]').check()
    await page.locator('[data-test="purpose-alias-1"]').fill('This is another purpose description')
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the purpose changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(
      'Make-Up Or Top Up Water (This is another purpose description)'
    )

    // confirm we see the points selected
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )

    // choose the change option for points
    await page.locator('[data-test="change-points-0"]').click()

    // change the points and continue
    await page.locator('#points').uncheck()
    await page.locator('#points-2').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the points changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )

    // confirm we see the abstraction period selected
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('From 1 December to 3 September')

    // choose the change option for the abstraction period
    await page.locator('[data-test="change-abstraction-period-0"]').click()

    // change the abstraction period and continue
    await page.locator('#abstractionPeriodStartDay').clear()
    await page.locator('#abstractionPeriodStartMonth').clear()
    await page.locator('#abstractionPeriodEndDay').clear()
    await page.locator('#abstractionPeriodEndMonth').clear()

    await page.locator('#abstractionPeriodStartDay').fill('02')
    await page.locator('#abstractionPeriodStartMonth').fill('10')
    await page.locator('#abstractionPeriodEndDay').fill('05')
    await page.locator('#abstractionPeriodEndMonth').fill('12')
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the abstraction period changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('From 2 October to 5 December')

    // confirm we see the returns cycle selected
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Summer')

    // choose the change option for the returns cycle
    await page.locator('[data-test="change-returns-cycle-0"]').click()

    // change the returns cycle and continue
    await page.locator('#winterAndAllYear').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the returns cycle changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Winter')

    // confirm we see the site description we selected
    await expect(page.locator('[data-test="site-description-0"]')).toContainText('This is a valid site description')

    // choose the change option for the site description
    await page.locator('[data-test="change-site-description-0"]').click()

    // change the site description and continue
    await page.locator('#siteDescription').clear()
    await page.locator('#siteDescription').fill('This is another valid site description')
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the site description changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="site-description-0"]')).toContainText(
      'This is another valid site description'
    )

    // confirm we see the collection frequency we selected
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Daily')

    // choose the change option for the collection frequency
    await page.locator('[data-test="change-frequency-collected-0"]').click()

    // change the collection frequency and continue
    await page.locator('#frequencyCollectedWeek').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the collection frequency changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Weekly')

    // confirm we see the reporting frequency we selected
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Daily')

    // choose the change option for the reporting frequency
    await page.locator('[data-test="change-frequency-reported-0"]').click()

    // change the reporting frequency and continue
    await page.locator('#frequencyReportedMonth').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the reporting frequency changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Monthly')

    // confirm we see the agreements and exceptions we selected
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText('Gravity fill')

    // choose the change option for agreements exceptions
    await page.locator('[data-test="change-agreements-exceptions-0"]').click()

    // change the agreements exceptions and continue
    await page.locator('#gravityFill').uncheck()
    await page.locator('#transferReAbstractionScheme').check()
    await page.locator('#twoPartTariff').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page and see the agreements exceptions changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText(
      'Transfer re-abstraction scheme and Two-part tariff'
    )

    // click the add another requirement button
    await page.getByText('Add another requirement').click()

    // confirm we are on the purpose page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    await page.locator('[data-test="purpose-0"]').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the points page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    await page.locator('#points').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the abstraction period page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Enter the abstraction period for the requirements for returns'
    )

    // enter start and end dates for the abstraction period and click continue
    await page.locator('#abstractionPeriodStartDay').fill('07')
    await page.locator('#abstractionPeriodStartMonth').fill('07')
    await page.locator('#abstractionPeriodEndDay').fill('08')
    await page.locator('#abstractionPeriodEndMonth').fill('12')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Select the returns cycle for the requirements for returns'
    )

    // choose a returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the site description page
    await expect(page.locator('h1')).toHaveText('Enter a site description for the requirements for returns')

    // enter a site description and continue
    await page.locator('#siteDescription').fill('This is a valid site description for the second requirement')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings collected page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    await page.locator('#frequencyCollectedMonth').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings reported page
    await expect(page.locator('.govuk-heading-l')).toContainText('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    await page.locator('#frequencyReportedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the agreements and exceptions page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Select agreements and exceptions for the requirements for returns'
    )

    // choose a agreement and exception and continue
    await page.locator('#gravityFill').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the new requirement
    await expect(page.locator('[data-test="requirement-1"]')).toContainText(
      'This is a valid site description for the second requirement'
    )

    // choose the remove requirement button for the second requirement
    await page.locator('[data-test="remove-1"]').click()

    // confirm we are on the remove page
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'You are about to remove these requirements for returns'
    )

    // confirm we see the correct requirement to be removed
    await expect(
      page.getByText(
        'Summer daily requirements for returns, This is a valid site description for the second requirement.'
      )
    ).toBeVisible()

    // choose the remove button
    await page.getByRole('button', { name: 'Remove' }).click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we receive a notification pop up confirming the removed requirement
    await expect(page.locator('.govuk-notification-banner')).toContainText('Requirement removed')

    // confirm the second requirement has been removed
    await expect(page.locator('[data-test="requirement-1"]')).toHaveCount(0)

    // choose the approve return requirement button
    await page.getByText('Approve returns requirement').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up
    await page.getByText('Return to licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // Confirm we can display the return version details
    await page.locator('[data-test="return-version-0"]').click()

    await expect(page.locator('h1')).toContainText('Requirements for returns starting 2 August 2023')

    await expect(page.getByText('approved', { exact: true })).toBeVisible()
    await expect(page.locator('.govuk-body-l')).toContainText('Minor change created on')
    await expect(page.locator('.govuk-body-l')).toContainText('by billing.data@wrls.gov.uk')

    // Return requirement 1
    await expect(page.locator('#requirement-0').getByRole('heading', { level: 2 })).toContainText(
      'This is another valid site description'
    )
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(
      'Make-Up Or Top Up Water (This is another purpose description)'
    )
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('2 October to 5 December')
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Winter and all year')
    await expect(page.locator('[data-test="site-description-0"]')).toContainText(
      'This is another valid site description'
    )
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Weekly')
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Monthly')
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText(
      'Transfer re-abstraction scheme and Two-part tariff'
    )
  })
})
