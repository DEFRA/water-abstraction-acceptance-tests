import scenarioData from '../../support/scenarios/unregistered-licence.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit no returns requirement (internal)', () => {
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

  test('creates a no return requirement and approves the requirement', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/set-up`)

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up no returns requirement
    await page.getByText("Mark licence as 'no returns needed'").click()

    // confirm we are on the start date page
    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')

    // choose the licence version start date and click continue
    await page.locator('#licenceStartDate').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the why no returns required page
    await expect(page.locator('h1')).toContainText('Why are no returns required?')

    // choose returns exception and click continue
    await page.locator('#licenceConditionsDoNotRequireReturns').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see text about no returns required
    await expect(page.getByText('Returns are not required for this licence')).toBeVisible()

    // confirm we are seeing the details we selected
    await expect(page.locator('[data-test="start-date"]')).toContainText('1 January 2018')
    await expect(page.locator('[data-test="reason"]')).toContainText('Licence conditions do not require returns')

    // click the change link for the reason
    await page.locator('[data-test="change-reason"]').click()

    // confirm we are on the why no returns required page
    await expect(page.locator('h1')).toContainText('Why are no returns required?')

    // choose returns exception and click continue
    await page.locator('#returnsException').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on check page and see the reason changes
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await expect(page.locator('[data-test="reason"]')).toContainText('Returns exception')

    // confirm we see the option to add note
    await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()

    // confirm no notes have been added
    await expect(page.getByText('No notes added')).toBeVisible()

    // click add a note
    await page.getByText('Add a note').click()

    // confirm we are on note page
    await expect(page.locator('h1')).toContainText('Add a note')

    // type a note and click the confirm button
    await page.locator('#note').fill('This is a note for a no returns requirement.')
    await page.getByText('Confirm').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see pop up notification confirming changes have been made
    await expect(page.locator('.govuk-notification-banner')).toContainText('Note added')

    // confirm we see the note added
    await expect(page.getByText('This is a note for a no returns requirement.')).toBeVisible()

    // click the change note link
    await page.locator('[data-test="note"]').click()

    // make changes to the note and confirm
    await page.locator('#note').clear()
    await page.locator('#note').fill('This is new and improved note for a no return requirement.')
    await page.getByText('Confirm').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see pop up notification confirming changes have been made
    await expect(page.locator('.govuk-notification-banner')).toContainText('Note updated')

    // confirm we see the note added
    await expect(page.getByText('This is new and improved note for a no return requirement.')).toBeVisible()

    // click the delete note link
    await page.getByText('Delete').click()

    // confirm we see pop notification confirming deleted note
    await expect(page.locator('.govuk-notification-banner')).toContainText('Note deleted')

    // confirm no notes have been added
    await expect(page.getByText('No notes added')).toBeVisible()

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
    await expect(page.locator('.govuk-body-l')).toContainText('Returns exception created on')
    await expect(page.locator('.govuk-body-l')).toContainText('by billing.data@wrls.gov.uk')
    await expect(page.locator('h3')).toContainText('Returns are not required for this licence')
  })
})
