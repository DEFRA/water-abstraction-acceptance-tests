import { test, expect } from '../../support/fixtures.js'
import { prepareScenario } from '../../migration/prepare-scenario.js'
import scenarioData from '../../../cypress/support/scenarios/user-registered-to-licence.js'

const USER_EMAIL = 'unregister-user@wrlstest.gov.uk'

test.describe('Unregister a licence (internal)', () => {
  let scenario

  test.beforeEach(async ({ load, login, users }) => {
    scenario = prepareScenario(scenarioData(), { userEmail: USER_EMAIL })
    await load(scenario)
    await login(users.billingAndData)
  })

  test.afterEach(async ({ tearDown }) => {
    await tearDown(scenario.licences[0].licenceRef, scenario.companies[0].name, USER_EMAIL)
  })

  test('can unregister a licence from its primary user', async ({ page }) => {
    const { licenceRef } = scenario.licences[0]

    await page.goto('/')

    // Search for the user and then select them
    await page.locator('#query').fill(USER_EMAIL)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(USER_EMAIL)
    await page.locator('.searchresult-link').click()

    // Select the external user's licences page
    await page.locator(':nth-child(2) > .x-govuk-sub-navigation__link').click()

    // Start the unregister licence journey
    await page.locator('.govuk-button').filter({ hasText: 'Unregister licence' }).click()

    // Select the licence to be unregistered
    await expect(page.locator('.govuk-label')).toContainText(licenceRef)
    await expect(page.locator('#licences-item-hint')).toContainText(scenario.companies[0].name)
    await page.locator('[name="licences"]').click()
    await page.locator('.govuk-button').filter({ hasText: 'Continue' }).click()

    // Confirm licences to unregister
    await expect(page.locator('#main-content > dl > div > dd.govuk-summary-list__value > p')).toContainText(licenceRef)
    await page.locator('button.govuk-button').filter({ hasText: 'Confirm' }).click()

    // Confirm notification and licence is no longer shown
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Licences unregistered')
    await expect(page.locator('[data-test="no-licences-msg"]')).toContainText('This user has no linked licences.')

    // Confirm the licence is now shown as unregistered
    await page.locator('#nav-search').click()
    await page.locator('#query').fill(licenceRef)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licenceRef)
    await page.locator('.searchresult-link').click()

    await expect(page.locator('.govuk-caption-l')).toContainText('Unregistered licence')
  })
})
