import scenarioData from '../../support/scenarios/licence.scenario.js'
import { formatLongDate, yesterday } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Create, replace then add a charge version (internal)', { tag: '@supplementary-billing' }, () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    licence = scenario.licence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test(
    'all three states of a charge version; creating, replacing and adding charge versions to a licence',
    {
      annotation: {
        type: 'description',
        description:
          'Runs three charge information versions for a licence (new licence, error correction, major change), confirming and approving each via the review flow, and asserts the charge version table rows reflect the resulting review, approved and replaced statuses and superseded date ranges.'
      }
    },
    async ({ page }) => {
      await page.goto(`/system/licences/${licence.id}/set-up`)
      const chargeTable = page.locator('table.govuk-table')

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio', { name: 'New licence', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Licence version start date' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Who should the bills go to?')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select an existing address for Big Farm Co Ltd')
      await page.locator('#selectedAddress').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do you need to add an FAO?')
      await page.getByRole('radio', { name: 'No' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check billing account details')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.locator('#useAbstractionData').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Set a charge reference' }).click()

      await expect(page.locator('h1')).toContainText('Enter a description for the charge reference')
      await page.locator('#description').fill('Test charge reference 1 - Spray Irrigation - Direct')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the source')
      await page.getByRole('radio', { name: 'Non-tidal' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the loss category')
      await page.locator('#loss').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Enter the total quantity to use for this charge reference')

      await page.locator('#volume').fill('1.554')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the water availability')
      await page.locator('#isRestrictedSource').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the water modelling charge')
      await page.locator('#waterModel').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do additional charges apply?')
      await page.getByRole('radio', { name: 'No' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do adjustments apply?')
      await page.locator('#isAdjustments').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Which adjustments apply?')
      await page.getByRole('checkbox', { name: 'Two-part tariff agreement' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      const newLicenceRow = chargeTable.getByRole('row', { name: 'New licence' })
      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'review',
        'Review'
      ])
      await newLicenceRow.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByText('This licence has been marked for the next supplementary bill run.').click()
      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'approved',
        'View'
      ])
      await page.getByRole('link', { name: 'Licence summary' }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByText('This licence has been marked for the next supplementary bill run.').click()
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio', { name: 'Error correction' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Licence version start date' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select an existing billing account for Big Farm Co Ltd')
      await page.locator('#billingAccountId').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      const errorCorrectionRow = chargeTable.getByRole('row', { name: 'Error correction' })
      await expect(errorCorrectionRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'Error correction',
        'review',
        'Review'
      ])

      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'approved',
        'View'
      ])
      await errorCorrectionRow.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(errorCorrectionRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'Error correction',
        'approved',
        'View'
      ])
      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'replaced',
        'View'
      ])
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio', { name: 'Major change' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { description: formatLongDate(new Date()), exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select an existing billing account for Big Farm Co Ltd')
      await page.locator('#billingAccountId').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('section', { hasText: 'Charge element 1' })
        .locator('.govuk-summary-list__row', { hasText: 'Annual quantities' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Add annual quantities')
      await page.getByRole('textbox', { name: 'Authorised' }).fill('1')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Add another element' }).click()

      await expect(page.locator('h1')).toContainText('Select a purpose use')
      await page.getByRole('radio').check() // Conflicting id (#purpose) means we can not filter by name here, so we select the only radio on the page
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Add element description')
      await page.locator('#description').fill('Spray Irrigation South Borehole')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set abstraction period')
      await page.getByRole('group', { name: 'Start date' }).getByLabel('Day').fill('1')
      await page.getByRole('group', { name: 'Start date' }).getByLabel('Month').fill('4')
      await page.getByRole('group', { name: 'End date' }).getByLabel('Day').fill('31')
      await page.getByRole('group', { name: 'End date' }).getByLabel('Month').fill('3')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Add annual quantities')
      await page.getByRole('textbox', { name: 'Authorised' }).fill('0.554')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set time limit?')
      await page.getByRole('radio', { name: 'No' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select loss category')
      await page
        .getByRole('radio', { description: 'This is the default loss category for the purpose chosen', exact: true })
        .check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Should two-part tariff agreements apply to this element?')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Set a charge reference' }).click()

      await expect(page.locator('h1')).toContainText('Enter a description for the charge reference')
      await page.locator('#description').fill('Test Charge reference 2')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the source')
      await page.getByRole('radio', { name: 'Non-tidal' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the loss category')
      await page.locator('#loss').nth(1).check() // Conflicting id means we can not use the role selector here, so we have to use the id and nth(1) to select the second option

      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Enter the total quantity to use for this charge reference')
      await page.locator('#volume').click()
      await page.locator('#volume').fill('0.554')
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the water availability')
      await page.locator('#isRestrictedSource').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the water modelling charge')
      await page.locator('#waterModel').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do additional charges apply?')
      await page.getByRole('radio', { name: 'No' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Do adjustments apply?')
      await page.locator('#isAdjustments').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Which adjustments apply?')
      await page.getByRole('checkbox', { name: 'Two-part tariff agreement' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      const majorChangeRow = chargeTable.getByRole('row', { name: 'Major change' })
      await expect(majorChangeRow.getByRole('cell')).toHaveText([
        formatLongDate(new Date()),
        '',
        'Major change',
        'review',
        'Review'
      ])
      await expect(errorCorrectionRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'Error correction',
        'approved',
        'View'
      ])
      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'replaced',
        'View'
      ])
      await majorChangeRow.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(majorChangeRow.getByRole('cell')).toHaveText([
        formatLongDate(new Date()),
        '',
        'Major change',
        'approved',
        'View'
      ])
      await expect(errorCorrectionRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        formatLongDate(yesterday()),
        'Error correction',
        'approved',
        'View'
      ])
      await expect(newLicenceRow.getByRole('cell')).toHaveText([
        formatLongDate(licence.startDate),
        '',
        'New licence',
        'replaced',
        'View'
      ])
    }
  )
})
