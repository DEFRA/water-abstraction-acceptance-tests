import scenarioData from '../../support/scenarios/licence-with-two-purposes-and-requirements.scenario.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Update the purpose and points of a copied return requirement and add another manually (internal)', () => {
  let licence
  let returnRequirementPurpose

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      returnRequirementPurposes: [scenarioReturnRequirementPurpose]
    } = scenario

    licence = scenarioLicence
    returnRequirementPurpose = scenarioReturnRequirementPurpose

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('copies an existing requirement, updates its purpose and points, adds another requirement manually, and approves both', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // choose the licence version start date and click continue
    await page.locator('#licenceStartDate').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the reason page
    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')

    await page.locator('#minorChange').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    await page.locator('#useExistingRequirements').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the existing requirements page
    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')

    // choose a previous requirements for returns and continue
    await page.locator('#existing').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the start date and reason selected
    await expect(page.locator('[data-test="start-date"]')).toContainText(formatLongDate(licence.startDate))
    await expect(page.locator('[data-test="reason"]')).toContainText('Minor change')

    // confirm we see the purpose and purpose description for the requirement copied from existing
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(returnRequirementPurpose.alias)

    // choose the change link for the purpose and confirm we are on the purpose page
    await page.locator('[data-test="change-purposes-0"]').click()
    await expect(page.locator('h1')).toContainText('Select the purpose for the requirements for returns')

    // choose another purpose and add another purpose description and click continue
    await page.locator('[data-test="purpose-0"]').uncheck()
    await page.locator('[data-test="purpose-1"]').check()
    await page.locator('[data-test="purpose-alias-1"]').fill('This is another purpose description')
    await page.locator('form > .govuk-button').click()

    // confirm we see the purpose changes on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(
      'Spray Irrigation - Direct (This is another purpose description)'
    )

    // confirm we see the points for the requirement copied from existing
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )

    // choose the change link for the points and confirm we are on the points page
    await page.locator('[data-test="change-points-0"]').click()
    await expect(page.locator('h1')).toContainText('Select the points for the requirements for returns')

    // choose another points and continue
    await page.locator('#points').uncheck() // unchecking points -
    await page.locator('form > .govuk-button').click()

    // confirm we see the points changes on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )

    // choose add another requirement
    await page.getByText('Add another requirement').click()

    // confirm we are on the purpose page
    await expect(page.locator('h1')).toContainText('Select the purpose for the requirements for returns')

    // choose a purpose and continue
    await page.locator('[data-test="purpose-0"]').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the points page
    await expect(page.locator('h1')).toContainText('Select the points for the requirements for returns')

    // choose a points and continue
    await page.locator('#points').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the abstraction period page
    await expect(page.locator('h1')).toContainText('Enter the abstraction period for the requirements for returns')

    // choose a start and end date then continue
    await page.locator('#abstractionPeriodStartDay').fill('1')
    await page.locator('#abstractionPeriodStartMonth').fill('12')
    await page.locator('#abstractionPeriodEndDay').fill('3')
    await page.locator('#abstractionPeriodEndMonth').fill('11')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('h1')).toContainText('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the site description page
    await expect(page.locator('h1')).toHaveText('Enter a site description for the requirements for returns')

    // input a site description and continue
    await page.locator('#siteDescription').fill('Site description for another return requirement')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the frequency collected page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are collected')

    // choose a frequency for collection and continue
    await page.locator('#frequencyCollectedWeek').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the frequency reported page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are reported')

    // choose a frequency for reporting and continue
    await page.locator('#frequencyReportedWeek').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the agreements and exceptions page
    await expect(page.locator('h1')).toContainText('Select agreements and exceptions for the requirements for returns')

    // choose some agreements and exceptions and continue
    await page.locator('#transferReAbstractionScheme').check()
    await page.locator('#twoPartTariff').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the new requirement added message
    await expect(page.locator('.govuk-notification-banner')).toContainText('New requirement added')

    // confirm we see the new added requirement and details selected
    await expect(page.locator('[data-test="purposes-1"]')).toContainText('Make-Up Or Top Up Water')
    await expect(page.locator('[data-test="points-1"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )
    await expect(page.locator('[data-test="abstraction-period-1"]')).toContainText('From 1 December to 3 November')
    await expect(page.locator('[data-test="returns-cycle-1"]')).toContainText('Summer')
    await expect(page.locator('[data-test="site-description-1"]')).toContainText(
      'Site description for another return requirement'
    )
    await expect(page.locator('[data-test="frequency-collected-1"]')).toContainText('Weekly')
    await expect(page.locator('[data-test="frequency-reported-1"]')).toContainText('Weekly')
    await expect(page.locator('[data-test="agreements-exceptions-1"]')).toContainText(
      'Transfer re-abstraction scheme and Two-part tariff'
    )

    // choose the approve returns requirements button
    await page.getByText('Approve returns requirements').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up
    await page.getByText('Return to licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')
  })
})
