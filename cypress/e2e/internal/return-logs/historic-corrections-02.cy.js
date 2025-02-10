'use strict'

const {
  determineCycleDueDate,
  determineCycleEndDate,
  determineCycleStartDate
} = require('../../../lib/return-cycle-dates.lib.js')
const { formatLongDate } = require('../../../lib/formatters.lib.js')

describe('Submit summer and winter and all year historic correction using abstraction data', () => {
  let returnCycleDueDate
  let longDueDate
  let year = new Date().getFullYear()
  let winterYear = new Date().getFullYear()
  let summerYear = new Date().getFullYear()

  if (new Date().getMonth() < 4) {
    year = year - 1
  }

  beforeEach(() => {
    cy.tearDown()

    cy.fixture('return-logs-historic-02.json').then((fixture) => {
      for (let i = 0; i < fixture.returnLogs.length; i++) {
        if (i % 2 === 0) {
          if (new Date().getMonth() < 4) {
            winterYear = winterYear - 1
          }
          fixture.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999990:${winterYear}-04-01:${winterYear + 1}-03-31`
          fixture.returnLogs[i].dueDate = `${winterYear + 1}-04-28`
          fixture.returnLogs[i].endDate = `${winterYear + 1}-03-31`
          fixture.returnLogs[i].startDate = `${winterYear}-04-01`
          fixture.returnLogs[i].returnCycleId.value = `${winterYear}-04-01`
        } else {
          if (new Date().getMonth() < 11) {
            summerYear = summerYear - 1
          }

          fixture.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999991:${summerYear}-11-01:${summerYear + 1}-10-31`
          fixture.returnLogs[i].dueDate = `${summerYear + 1}-11-28`
          fixture.returnLogs[i].endDate = `${summerYear + 1}-10-31`
          fixture.returnLogs[i].startDate = `${summerYear}-11-01`
          fixture.returnLogs[i].returnCycleId.value = `${summerYear}-11-01`
        }

      }
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('#email').type(userEmail)
    })

    cy.get('#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('form > .govuk-button').click()

    // assert the user signed in and we're on the search page
    cy.contains('Search')

    // search for a licence
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page
    cy.contains('AT/CURR/DAILY/01')

    // click returns tab
    cy.contains('Returns').click()

    // confirm we are on the licence returns tab and that there are previous reuturn logs
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    const determinationDate = new Date()
    returnCycleDueDate = determineCycleDueDate(true, determinationDate)
    cy.get('[data-test="return-due-date-0"]').contains(formatLongDate(returnCycleDueDate))
    cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')

    returnCycleDueDate = determineCycleDueDate(false, determinationDate)
    cy.get('[data-test="return-due-date-1"]').contains(formatLongDate(returnCycleDueDate))
    cy.get('[data-test="return-status-1"] > .govuk-tag').contains('due')

    determinationDate.setFullYear(determinationDate.getFullYear() - 1)
    returnCycleDueDate = determineCycleDueDate(true, determinationDate)
    cy.get('[data-test="return-due-date-2"]').contains(formatLongDate(returnCycleDueDate))
    cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')

    returnCycleDueDate = determineCycleDueDate(false, determinationDate)
    cy.get('[data-test="return-due-date-3"]').contains(formatLongDate(returnCycleDueDate))
    cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')

    // click licence set up tab
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // set the start date to be the beginning of the current winter and all year cycle
    const winterAndAllYearStartDate = determineCycleStartDate(false)
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('01')
    cy.get('#other-start-date-month').type('04')
    cy.get('#other-start-date-year').type(winterAndAllYearStartDate.getFullYear())
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#reason-10').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // choose copy from existing requirements and continue
    cy.get('#method-2').check()
    cy.contains('Continue').click()

    // confirm we are on the existing requirements page
    cy.get('.govuk-fieldset__heading').contains('Use previous requirements for returns')

    // choose a previous requirements for returns and continue
    cy.get('#existing').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    cy.contains('Return to licence set up').click()
    cy.contains('Returns').click()

    // confirm we are on the licence set up tab
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    const dueDate = new Date()
    returnCycleDueDate = determineCycleDueDate(true, dueDate)
    longDueDate = formatLongDate(returnCycleDueDate)
    cy.get('[data-test="return-due-date-0"]').contains(longDueDate)
    cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-1"]').contains(longDueDate)
    cy.get('[data-test="return-status-1"] > .govuk-tag').contains('void')

    returnCycleDueDate = determineCycleDueDate(false, dueDate)
    longDueDate = formatLongDate(returnCycleDueDate)
    cy.get('[data-test="return-due-date-2"]').contains(longDueDate)
    cy.get('[data-test="return-status-2"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-3"]').contains(longDueDate)
    cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')

    dueDate.setFullYear(dueDate.getFullYear() - 1)
    returnCycleDueDate = determineCycleDueDate(true, dueDate)
    longDueDate = formatLongDate(returnCycleDueDate)
    cy.get('[data-test="return-due-date-4"]').contains(longDueDate)
    cy.get('[data-test="return-status-4"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-5"]').contains(longDueDate)
    cy.get('[data-test="return-status-5"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-6"]').contains(longDueDate)
    cy.get('[data-test="return-status-6"] > .govuk-tag').contains('void')

    dueDate.setFullYear(dueDate.getFullYear())
    returnCycleDueDate = determineCycleDueDate(false, dueDate)
    longDueDate = formatLongDate(returnCycleDueDate)
    cy.get('[data-test="return-due-date-7"]').contains(longDueDate)
    cy.get('[data-test="return-status-7"] > .govuk-tag').contains('complete')
  })
})
