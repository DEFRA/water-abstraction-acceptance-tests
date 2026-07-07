import scenarioData from '../../support/scenarios/unregistered-licence-with-two-purposes-and-requirements.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

test.describe('Cancel a return requirement (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('cancels a return requirement after completing the journey', async ({ page }) => {
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

    // choose returns exception and click continue
    await page.locator('#changeToSpecialAgreement').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // click set up manually and continue
    await page.locator('#setUpManually').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the purpose page
    await expect(page.locator('h1')).toContainText('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    await page.locator('[data-test="purpose-0"]').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the points page
    await expect(page.locator('h1')).toContainText('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    await page.locator('#points').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the abstraction period page
    await expect(page.locator('h1')).toContainText('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    await page.locator('#abstractionPeriodStartDay').fill('01')
    await page.locator('#abstractionPeriodStartMonth').fill('12')
    await page.locator('#abstractionPeriodEndDay').fill('03')
    await page.locator('#abstractionPeriodEndMonth').fill('09')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('h1')).toContainText('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the site description page
    await expect(page.locator('h1')).toHaveText('Enter a site description for the requirements for returns')

    // enter a site description and continue
    await page.locator('#siteDescription').fill('This is a valid site description')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings collected page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    await page.locator('#frequencyCollectedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings reported page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    await page.locator('#frequencyReportedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the agreements and exceptions page
    await expect(page.locator('h1')).toContainText('Select agreements and exceptions for the requirements for returns')

    // choose an agreement and exception and continue
    await page.locator('#gravityFill').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the start date information we expect
    await expect(page.locator('[data-test="start-date"]')).toContainText('1 January 2018')

    // confirm we see the reason we selected
    await expect(page.locator('[data-test="reason"]')).toContainText('Change to special agreement')

    // confirm we see the purposes selected
    await expect(page.locator('[data-test="purposes-0"]')).toContainText('General Farming & Domestic')

    // confirm we see the points selected
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )

    // confirm we see the abstraction period selected
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('From 1 December to 3 September')

    // confirm we see the returns cycle selected
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Summer')

    // confirm we see the site description we selected
    await expect(page.locator('[data-test="site-description-0"]')).toContainText('This is a valid site description')

    // confirm we see the collection frequency we selected
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Daily')

    // confirm we see the reporting frequency we selected
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Daily')

    // confirm we see the agreements and exceptions we selected
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText('Gravity fill')

    // choose the cancel return requirement button
    await page.getByText('Cancel return requirement').click()

    // confirm we are on the cancel page
    await expect(page.getByText('You are about to cancel these requirements for returns')).toBeVisible()

    // confirm we see the requirements we are going to cancel
    await expect(
      page.getByText('Summer daily requirements for returns, This is a valid site description.')
    ).toBeVisible()

    // click the confirm cancel button
    await page.getByRole('button', { name: 'Confirm cancel' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')
  })
})
