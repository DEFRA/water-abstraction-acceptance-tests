import { users } from '../../support/default-values.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Creating internal user with existing external account (internal)', () => {
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('external-gov-uk-user')

    user = scenario.user
  })

  test.beforeEach(async ({ login }) => {
    await login(users.BILLING_AND_DATA)
  })

  test(
    'can create an internal user even if they have an external user account with the same email',
    {
      annotation: {
        type: 'issue',
        description: 'https://eaflood.atlassian.net/browse/WATER-5739'
      }
    },
    async ({ page }) => {
      await page.goto('/account/create-user')

      // Enter the same username as the existing external user with a 'gov.uk' address
      await expect(page.locator('.govuk-label')).toContainText('Enter a gov.uk email address')
      await page.locator('input#email').fill(user.username)
      await page.locator('form > .govuk-button').click()

      // Confirm we see 8 permission types. Then pick one for our user
      await expect(page.locator('div.govuk-radios').locator('> *')).toHaveCount(8)
      await page.locator('[type="radio"][value="basic"]').check()
      await page.locator('form > .govuk-button').click()

      // Confirm we see confirmation of the new account created
      await expect(page.locator('h1.govuk-heading-l')).toContainText('New account created')
      await expect(page.locator("span[class='govuk-!-font-weight-bold']")).toContainText(user.username)
    }
  )
})
