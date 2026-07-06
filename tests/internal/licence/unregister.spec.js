import scenarioData from '../../support/scenarios/registered-licence.scenario.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  companies: [company],
  licences: [licence],
  users: [user]
} = scenario

test.describe('Unregister a licence (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can unregister a licence from its primary user', async ({ page }) => {
    await page.goto('/')

    // Search for the user and then select them
    await page.locator('#query').fill(user.username)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(user.username)
    await page.locator('.searchresult-link').click()

    // Select the external user's licences page
    await page.locator(':nth-child(2) > .x-govuk-sub-navigation__link').click()

    // Start the unregister licence journey
    await page.locator('.govuk-button').filter({ hasText: 'Unregister licence' }).click()

    // Select the licence to be unregistered
    await expect(page.locator('.govuk-label')).toContainText(licence.licenceRef)
    await expect(page.locator('#licences-item-hint')).toContainText(company.name)
    await page.locator('[name="licences"]').click()
    await page.locator('.govuk-button').filter({ hasText: 'Continue' }).click()

    // Confirm licences to unregister
    await expect(page.locator('#main-content > dl > div > dd.govuk-summary-list__value > p')).toContainText(
      licence.licenceRef
    )
    await page.locator('button.govuk-button').filter({ hasText: 'Confirm' }).click()

    // Confirm notification and licence is no longer shown
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Licences unregistered')
    await expect(page.locator('[data-test="no-licences-msg"]')).toContainText('This user has no linked licences.')

    // Confirm the licence is now shown as unregistered
    await page.locator('#nav-search').click()
    await page.locator('#query').fill(licence.licenceRef)
    await page.locator('#search-button').click()
    await expect(page.locator('.searchresult-row')).toContainText(licence.licenceRef)
    await page.locator('.searchresult-link').click()

    await expect(page.locator('.govuk-caption-l')).toContainText('Unregistered licence')
  })
})
