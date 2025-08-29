'use strict'

import licence from '../../../support/fixture-builder/licence.js'
import points from '../../../support/fixture-builder/points.js'
import purposes from '../../../support/fixture-builder/purposes.js'
import returnLogs from '../../../support/fixture-builder/return-logs.js'
import returnRequirements from '../../../support/fixture-builder/return-requirements.js'
import returnRequirementPoints from '../../../support/fixture-builder/return-requirement-points.js'
import returnVersion from '../../../support/fixture-builder/return-version.js'

const dataModel = {
  ...licence(),
  ...points(),
  ...purposes(),
  ...returnVersion(),
  ...returnRequirements(),
  ...returnRequirementPoints()
  ...returnLogs(4)
}

describe('Submit winter and all year quarterly historic correction using abstraction data', () => {
  let year = new Date().getFullYear()
  if (new Date().getMonth() < 4) {
    year = year - 1
  }

  beforeEach(() => {
    cy.tearDown()

    // Get the user email and login as the user
    cy.fixture('users.json').its('billingAndData').as('userEmail')
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    dataModel.returnLogs[0].id = `v1:9:AT/CURR/DAILY/01:9999990:${year + 1}-01-01:${year + 1}-03-31`
    dataModel.returnLogs[0].dueDate = `${year + 1}-04-28`
    dataModel.returnLogs[0].endDate = `${year + 1}-03-31`
    dataModel.returnLogs[0].startDate = `${year + 1}-01-01`
    dataModel.returnLogs[0].returnCycleId.value = `${year}-04-01`

    dataModel.returnLogs[1].id = `v1:9:AT/CURR/DAILY/01:9999990:${year}-10-01:${year}-12-31`
    dataModel.returnLogs[1].dueDate = `${year + 1}-01-28`
    dataModel.returnLogs[1].endDate = `${year}-12-31`
    dataModel.returnLogs[1].startDate = `${year}-10-01`
    dataModel.returnLogs[1].returnCycleId.value = `${year}-04-01`

    dataModel.returnLogs[2].id = `v1:9:AT/CURR/DAILY/01:9999990:${year}-07-01:${year}-09-30`
    dataModel.returnLogs[2].dueDate = `${year}-10-28`
    dataModel.returnLogs[2].endDate = `${year}-09-30`
    dataModel.returnLogs[2].startDate = `${year}-07-01`
    dataModel.returnLogs[2].returnCycleId.value = `${year}-04-01`

    dataModel.returnLogs[3].id = `v1:9:AT/CURR/DAILY/01:9999990:${year}-04-01:${year}-06-30`
    dataModel.returnLogs[3].dueDate = `${year}-07-28`
    dataModel.returnLogs[3].endDate = `${year}-06-30`
    dataModel.returnLogs[3].startDate = `${year}-04-01`
    dataModel.returnLogs[3].returnCycleId.value = `${year}-04-01`

    cy.load(dataModel)
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.visit(`/system/licences/${dataModel.licences[0].id}/returns`)

    // confirm we are on the licence returns tab and that there are previous reuturn logs
    cy.get('#returns > .govuk-heading-l').contains('Returns')
    cy.get('[data-test="return-due-date-0"]').contains(`28 April ${year + 1}`)
    cy.get('[data-test="return-status-0"] > .govuk-tag').contains('not due yet')
    cy.get('[data-test="return-due-date-1"]').contains(`28 January ${year + 1}`)
    cy.get('[data-test="return-status-1"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-2"]').contains(`28 October ${year}`)
    cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-3"]').contains(`28 July ${year}`)
    cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')

    // click licence set up tab
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // set the start date to be at the start of the all year return cycle
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('01')
    cy.get('#other-start-date-month').type('04')
    cy.get('#other-start-date-year').type(year)
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-heading-l').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#reason-10').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-heading-l').contains('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    cy.get('#method').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // click on the change link for addiontal submission options
    cy.get('[data-test="change-additional-submission-options"]').click()

    // click Continue
    cy.get('.govuk-button').contains('Continue').click()

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    cy.contains('Return to licence set up').click()
    cy.contains('Returns').click()

    // confirm we are on the licence set up tab
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    cy.quarterlyReturnLogDueData(`${year + 1}-04-28`).then((data) => {
      cy.get('[data-test="return-due-date-0"]').contains(data.text)
      cy.get('[data-test="return-status-0"] > .govuk-tag').contains('void')

      cy.get('[data-test="return-due-date-1"]').contains(data.text)
      cy.get('[data-test="return-status-1"] > .govuk-tag').contains(data.label)
    })

    cy.quarterlyReturnLogDueData(`${year + 1}-01-28`).then((data) => {
      cy.get('[data-test="return-due-date-2"]').contains(data.text)
      cy.get('[data-test="return-status-2"] > .govuk-tag').contains('void')

      cy.get('[data-test="return-due-date-3"]').contains(data.text)
      cy.get('[data-test="return-status-3"] > .govuk-tag').contains(data.label)
    })

    cy.quarterlyReturnLogDueData(`${year}-10-28`).then((data) => {
      cy.get('[data-test="return-due-date-4"]').contains(data.text)
      cy.get('[data-test="return-status-4"] > .govuk-tag').contains('void')

      cy.get('[data-test="return-due-date-5"]').contains(data.text)
      cy.get('[data-test="return-status-5"] > .govuk-tag').contains(data.label)
    })

    cy.quarterlyReturnLogDueData(`${year}-07-28`).then((data) => {
      cy.get('[data-test="return-due-date-6"]').contains(data.text)
      cy.get('[data-test="return-status-6"] > .govuk-tag').contains('void')

      cy.get('[data-test="return-due-date-7"]').contains(data.text)
      cy.get('[data-test="return-status-7"] > .govuk-tag').contains(data.label)
    })
  })
})
