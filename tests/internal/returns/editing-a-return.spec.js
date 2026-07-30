import scenarioData from '../../support/scenarios/licence-with-tpt-return-log-and-bill-run.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Editing a return (internal)', { tag: '@supplementaryBilling' }, () => {
  let licence
  let returnLog

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence],
      returnLogs: [scenarioReturnLog]
    } = scenario

    licence = scenarioLicence
    returnLog = scenarioReturnLog

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('submit a return for a licence from its returns tab and mark the licence for two-part tariff supplementary billing', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')
    await page.getByRole('link', { name: returnLog.returnReference }).click()

    await expect(page.locator('h1')).toContainText('Return details')
    await page.getByRole('button', { name: 'Edit return' }).click()

    await expect(page.locator('h1')).toContainText('When was the return received?')
    await page.locator('#today').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('What do you want to do with this return?')
    await page.locator('#enterReturn').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('How was this return reported?')
    await page.locator('#abstractionVolumes').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Which units were used?')
    await page.locator('#cubicMetres').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Have meter details been provided?')
    await page.locator('#no').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Is it a single volume?')
    await page.locator('#yes').click()
    await page.locator('#singleVolumeQuantity').fill('100')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('What period was used for this volume?')
    await page.locator('#default').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check details and enter new volumes or readings')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText(`Return ${returnLog.returnReference} submitted`)
    await page.getByRole('button', { name: 'Mark for supplementary bill run' }).click()

    await page.getByRole('link', { name: 'Licence summary' }).click()

    await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next two-part tariff supplementary bill run.'
    )
  })
})
