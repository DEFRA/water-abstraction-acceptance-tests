import scenarioData from '../../support/scenarios/licence-with-agreement.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe(
  'Recalculate bills link, selecting presroc (internal)',
  {
    tag: ['@supplementary-billing'],
    annotation: {
      type: 'description',
      description:
        'Selecting the presroc year on the recalculate bills page flags a licence for the old charge scheme regardless of whether a bill run has ever been sent for it.'
    }
  },
  () => {
    let licence

    // The scenario's agreement isn't used by the flagging logic under test — it's needed so the "Recalculate bills"
    // button renders on the licence set-up page at all.
    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      licence = scenario.licence

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('flags the licence for the next supplementary bill run for the old charge scheme', async ({ page }) => {
      await page.goto(`/system/licences/${licence.id}/set-up`)

      await page.locator('a.govuk-button', { hasText: 'Recalculate bills' }).click()

      await expect(page.locator('h1')).toContainText('Select which years you need to recalculate bills for')
      await page.locator('.govuk-caption-l', { hasText: licence.licenceRef }).click()
      await page.locator('[data-test="pre-sroc-years"]').click()
      await page.locator('.govuk-button').click()

      await expect(page.locator('.govuk-panel')).toContainText(
        "You've marked this licence for the next supplementary bill run"
      )
      await page.locator('.govuk-body > .govuk-link').click()

      await page.locator('nav a', { hasText: 'Licence summary' }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill run for the old charge scheme.'
      )
    })
  }
)
