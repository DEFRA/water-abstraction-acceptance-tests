import scenarioData from '../../support/scenarios/two-return-requirements-with-points.scenario.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

test.describe('Submit returns requirement (internal) using abstraction data', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return requirement using abstraction data and approves the requirement', async ({ page }) => {
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

    // choose reason (new licence) and click continue
    await page.locator('#newLicence').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    await page.locator('#useAbstractionData').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the start data and reason options selected previously
    await expect(page.locator('[data-test="start-date"]')).toContainText('1 January 2018')
    await expect(page.locator('[data-test="reason"]')).toContainText('New licence')

    // confirm we see return requirements generated from abstraction data
    // Return requirement 1
    await expect(page.locator('#requirement-0').getByRole('heading', { level: 2 })).toContainText('Example point 1')
    await expect(page.locator('[data-test="purposes-0"]')).toContainText('General Farming & Domestic')
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('From 1 April to 31 March')
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Winter and all year')
    await expect(page.locator('[data-test="site-description-0"]')).toContainText('Example point 1')
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Daily')
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Daily')
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText('None')

    // Return requirement 2
    await expect(page.locator('#requirement-1').getByRole('heading', { level: 2 })).toContainText('Example point 2')
    await expect(page.locator('[data-test="purposes-1"]')).toContainText('Make-Up Or Top Up Water')
    await expect(page.locator('[data-test="points-1"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )
    await expect(page.locator('[data-test="abstraction-period-1"]')).toContainText('From 1 April to 31 March')
    await expect(page.locator('[data-test="returns-cycle-1"]')).toContainText('Winter and all year')
    await expect(page.locator('[data-test="site-description-1"]')).toContainText('Example point 2')
    await expect(page.locator('[data-test="frequency-collected-1"]')).toContainText('Daily')
    await expect(page.locator('[data-test="frequency-reported-1"]')).toContainText('Daily')
    await expect(page.locator('[data-test="agreements-exceptions-1"]')).toContainText('None')

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

    await expect(page.locator('h1')).toContainText('Requirements for returns starting 1 January 2018')

    await expect(page.getByText('approved', { exact: true })).toBeVisible()
    await expect(page.locator('.govuk-body-l')).toContainText('New licence created on')
    await expect(page.locator('.govuk-body-l')).toContainText('by billing.data@wrls.gov.uk')

    // Return requirement 1
    await expect(page.locator('#requirement-0').getByRole('heading', { level: 2 })).toContainText('Example point 1')
    await expect(page.locator('[data-test="purposes-0"]')).toContainText('General Farming & Domestic')
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('1 April to 31 March')
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Winter and all year')
    await expect(page.locator('[data-test="site-description-0"]')).toContainText('Example point 1')
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Daily')
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Daily')
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText('None')

    // Return requirement 2
    await expect(page.locator('#requirement-1').getByRole('heading', { level: 2 })).toContainText('Example point 2')
    await expect(page.locator('[data-test="purposes-1"]')).toContainText('Make-Up Or Top Up Water')
    await expect(page.locator('[data-test="points-1"]')).toContainText(
      'At National Grid Reference TT 9876 5432 (Example point 2)'
    )
    await expect(page.locator('[data-test="abstraction-period-1"]')).toContainText('1 April to 31 March')
    await expect(page.locator('[data-test="returns-cycle-1"]')).toContainText('Winter and all year')
    await expect(page.locator('[data-test="site-description-1"]')).toContainText('Example point 2')
    await expect(page.locator('[data-test="frequency-collected-1"]')).toContainText('Daily')
    await expect(page.locator('[data-test="frequency-reported-1"]')).toContainText('Daily')
    await expect(page.locator('[data-test="agreements-exceptions-1"]')).toContainText('None')
  })
})
