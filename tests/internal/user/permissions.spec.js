import scenarioData from '../../support/scenarios/licence.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('User permissions (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test("confirms the Billing & Data user can access bill runs and a licence's bills tab", async ({
    page,
    login,
    users
  }) => {
    await login(users.billingAndData)
    await page.goto(`/system/licences/${licence.id}/summary`)

    // Confirm we are on the licence page
    await expect(page.locator('h1')).toContainText(licence.licenceRef)

    // Confirm we can see the summary, contact details, returns, communications, bill runs and licence set up links
    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licence summary',
      'Contact details',
      'Returns',
      'Communications',
      'Bills',
      'Licence set up'
    ])

    // Assert they can see the Bill runs page
    await expect(page.locator('#nav > ul')).toContainText('Bill runs')
  })

  test("confirms the PSC user cannot access bill runs and a licence's bills tab", async ({ page, login, users }) => {
    await login(users.psc)
    await page.goto(`/system/licences/${licence.id}/summary`)

    // Confirm we are on the licence page
    await expect(page.locator('h1')).toContainText(licence.licenceRef)

    // Confirm we can see the summary, contact details, returns, communications and licence set up tabs
    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licence summary',
      'Contact details',
      'Returns',
      'Communications',
      'Licence set up'
    ])

    // Confirm we cannot see the bills link
    await expect(page.locator('.x-govuk-sub-navigation__link').filter({ hasText: 'Bills' })).toHaveCount(0)
  })
})
