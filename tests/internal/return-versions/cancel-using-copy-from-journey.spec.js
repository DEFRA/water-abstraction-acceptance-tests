import scenarioData from '../../support/scenarios/unregistered-licence-with-two-purposes-and-requirements.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Cancel a return version using copy from existing (internal)', () => {
  let licence
  let returnRequirement
  let returnRequirementPurpose

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      returnRequirements: [scenarioReturnRequirement],
      returnRequirementPurposes: [scenarioReturnRequirementPurpose]
    } = scenario

    licence = scenarioLicence
    returnRequirement = scenarioReturnRequirement
    returnRequirementPurpose = scenarioReturnRequirementPurpose

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates but then cancels a return version using copy from existing journey (internal)', async ({ page }) => {
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

    // choose copy existing requirements and continue
    await page.locator('#useExistingRequirements').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the existing requirements page
    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')

    // choose the existing requirement to copy and continue
    await page.locator('#existing').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the start date information we expect
    await expect(page.locator('[data-test="start-date"]')).toContainText('1 January 2018')

    // confirm we see the reason we selected
    await expect(page.locator('[data-test="reason"]')).toContainText('Change to special agreement')

    // confirm we see the purposes copied from the existing requirement
    await expect(page.locator('[data-test="purposes-0"]')).toContainText(returnRequirementPurpose.alias)

    // confirm we see the points copied from the existing requirement
    await expect(page.locator('[data-test="points-0"]')).toContainText(
      'At National Grid Reference TQ 1234 5678 (Example point 1)'
    )

    // confirm we see the abstraction period copied from the existing requirement
    await expect(page.locator('[data-test="abstraction-period-0"]')).toContainText('From 1 January to 31 December')

    // confirm we see the returns cycle copied from the existing requirement
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Winter and all year')

    // confirm we see the site description copied from the existing requirement
    await expect(page.locator('[data-test="site-description-0"]')).toContainText(returnRequirement.siteDescription)

    // confirm we see the collection frequency copied from the existing requirement
    await expect(page.locator('[data-test="frequency-collected-0"]')).toContainText('Monthly')

    // confirm we see the reporting frequency copied from the existing requirement
    await expect(page.locator('[data-test="frequency-reported-0"]')).toContainText('Monthly')

    // confirm we see the agreements and exceptions copied from the existing requirement
    await expect(page.locator('[data-test="agreements-exceptions-0"]')).toContainText('None')

    // choose the cancel return requirement button
    await page.getByText('Cancel return requirement').click()

    // confirm we are on the cancel page
    await expect(page.getByText('You are about to cancel these requirements for returns')).toBeVisible()

    // confirm we see the requirements we are going to cancel
    await expect(
      page.getByText(`Winter and all year monthly requirements for returns, ${returnRequirement.siteDescription}.`)
    ).toBeVisible()

    // click the confirm cancel button
    await page.getByRole('button', { name: 'Confirm cancel' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')
  })
})
