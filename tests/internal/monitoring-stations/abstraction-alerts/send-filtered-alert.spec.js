import scenarioData from '../../../support/scenarios/registered-licences-with-monitoring-station-tagged.scenario.js'
import { tableRow } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Send an abstraction alert after applying a filter (internal)', () => {
  let firstLicence
  let firstUser
  let monitoringStation
  let secondLicence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const [scenarioFirstLicence, scenarioSecondLicence] = scenario.licences
    const [scenarioFirstUser] = scenario.users

    firstLicence = scenarioFirstLicence
    firstUser = scenarioFirstUser
    monitoringStation = scenario.monitoringStation
    secondLicence = scenarioSecondLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('creates and sends an abstraction alert for the tagged licence returned by the filter', async ({
    page,
    users
  }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText('')
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText('')

    await page.getByRole('button', { name: 'Create a water abstraction alert' }).click()

    await expect(page.locator('h1')).toContainText('Select the type of alert you need to send')
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)

    await page.locator('input[type="radio"][value="warning"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Which thresholds do you need to send an alert for?')
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)

    await page.locator('#alertThresholds').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toHaveText('Check the licence matches for the selected thresholds')
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)

    await expect(page.getByText('Showing all 2 abstraction alerts')).toBeVisible()

    // The table is sorted by licence ref and our refs are randomly generated, so we anchor on the ref rather than row
    // position
    const firstLicenceRow = tableRow(page, firstLicence.licenceRef)

    await expect(firstLicenceRow.locator('[data-test^="abstraction-period-"]')).toHaveText('10 October to 11 November')
    await expect(firstLicenceRow.locator('[data-test^="restriction-"]')).toHaveText('Stop')
    await expect(firstLicenceRow.locator('[data-test^="threshold-"]')).toHaveText('100m3/s')

    const secondLicenceRow = tableRow(page, secondLicence.licenceRef)

    await expect(secondLicenceRow.locator('[data-test^="abstraction-period-"]')).toHaveText('1 April to 31 March')
    await expect(secondLicenceRow.locator('[data-test^="restriction-"]')).toHaveText('Stop')
    await expect(secondLicenceRow.locator('[data-test^="threshold-"]')).toHaveText('100m3/s')

    await page.locator('.govuk-details__summary').click()
    await page.getByRole('checkbox', { name: '10 October to 11 November' }).check()
    await page.getByRole('button', { name: 'Apply filters' }).click()

    await expect(page.locator('h1')).toHaveText('Check the licence matches for the selected thresholds')
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)

    await expect(page.getByText('Showing 1 of 2 abstraction alerts')).toBeVisible()

    // Only one row survives the filter, so unlike the unfiltered table its row index is deterministic
    await expect(page.locator('[data-test="licence-ref-0"]')).toHaveText(firstLicence.licenceRef)
    await expect(page.locator('[data-test="abstraction-period-0"]')).toHaveText('10 October to 11 November')
    await expect(page.locator('[data-test="restriction-0"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('100m3/s')

    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select an email address to include in the alerts')
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-radios')).toContainText(users.environmentOfficer)

    await page.locator('input[type="radio"][value="username"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the recipients')
    await expect(page.locator('.govuk-caption-l')).toContainText('Notice WAA-')

    await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 recipients')
    await expect(page.locator('.govuk-table__body')).toContainText(firstUser.username)
    await expect(page.locator('.govuk-table__body')).toContainText(firstLicence.licenceRef)
    await expect(page.locator('.govuk-table__body')).toContainText('Email - primary user')
    await expect(page.locator('.govuk-table__body')).toContainText('Preview')
    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Water abstraction alerts sent')
    await expect(page.locator('.govuk-panel__body')).toContainText('Your reference number is WAA-')
    await page.getByRole('link', { name: 'View notice' }).click()

    await expect(page.locator('h1')).toContainText('Warning alert')
  })
})
