import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/licence-flagged-for-supplementary-with-current-annual-bill-run-and-second-company.scenario.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Change billing account in a previous financial year (internal)',
  { tag: '@supplementary-billing' },
  () => {
    let billingAccount
    let company
    let licence
    let secondCompany
    let toFinancialYearEnding

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      const [companyFromScenario, secondCompanyFromScenario] = scenario.companies

      billingAccount = scenario.billingAccount
      company = companyFromScenario
      secondCompany = secondCompanyFromScenario
      licence = scenario.licences[0]

      toFinancialYearEnding = scenario.billRun.toFinancialYearEnding

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('sends the sroc supplementary bill run, changes the billing account within a previous financial year, then confirms the credits and new bills', async ({
      page
    }) => {
      test.setTimeout(60000)

      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio').first().check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Another date' }).check()
      // The 1st of June, two financial years before the current one
      await page.locator('#customDate-day').fill('1')
      await page.locator('#customDate-month').fill('6')
      await page.locator('#customDate-year').fill(String(toFinancialYearEnding - 2))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing billing account for ${company.name}`)
      await page.getByRole('radio', { name: 'Set up a new billing account' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Who should the bills go to?')
      await page.getByRole('radio', { name: 'Another billing contact' }).check()
      await page.getByRole('textbox', { name: 'Search for organisation or individual' }).fill(secondCompany.name)
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Does this account already exist?')
      // The first radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#companyId').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing address for ${secondCompany.name}`)
      // Same markup defect as the radio above
      await page.locator('input#selectedAddress').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do you need to add an FAO?')
      await page.getByRole('radio', { name: 'No' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check billing account details')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByRole('link', { name: 'Review' })).toHaveCount(0)

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_EAST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_EAST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="credits-count"]')).toContainText('1 credit note')
      await expect(page.locator('[data-test="debits-count"]')).toContainText('4 invoices')

      const abstractorsTable = page.locator('[data-test="other-abstractors"]')
      const secondCompanyRows = abstractorsTable.getByRole('row', { name: secondCompany.name })

      await expect(secondCompanyRows).toHaveCount(2)
      await expect(secondCompanyRows.first()).toContainText(licence.licenceRef)
      await expect(secondCompanyRows.last()).toContainText(licence.licenceRef)

      const originalCompanyRows = abstractorsTable.getByRole('row', { name: billingAccount.accountNumber })

      await expect(originalCompanyRows).toHaveCount(3)
      await expect(originalCompanyRows.first()).toContainText(licence.licenceRef)
      await expect(originalCompanyRows.last()).toContainText(licence.licenceRef)
    })
  }
)
