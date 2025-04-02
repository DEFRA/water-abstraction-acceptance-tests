'use strict'

describe('Submit historic correction using abstraction data for two abstraction points', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31.
    cy.currentFinancialYearDate().then((currentFinancialYearInfo) => {
      currentFinancialYearInfo.startYear = currentFinancialYearInfo.year - 1

      cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')

      const startYear = currentFinancialYearInfo.startYear

      cy.fixture('return-logs-historic-03.json').then((fixture) => {
        let calculatedYear = startYear
        for (let i = 0; i < fixture.returnLogs.length; i++) {
          if (i % 2 === 0) {
            if (i !== 0) {
              calculatedYear = calculatedYear - 1
            }
            fixture.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999990:${calculatedYear}-04-01:${calculatedYear + 1}-03-31`
          } else {
            fixture.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999991:${calculatedYear}-04-01:${calculatedYear + 1}-03-31`
          }

          fixture.returnLogs[i].dueDate = `${calculatedYear + 1}-04-28`
          fixture.returnLogs[i].endDate = `${calculatedYear + 1}-03-31`
          fixture.returnLogs[i].startDate = `${calculatedYear}-04-01`
          fixture.returnLogs[i].returnCycleId.value = `${calculatedYear}-04-01`
        }

        cy.load(fixture)
      })
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
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.startYear
      const endYear = currentFinancialYearInfo.year

      cy.get('[data-test="return-due-date-0"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')
      cy.get('[data-test="return-due-date-1"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-1"] > .govuk-tag').contains('due')
      cy.get('[data-test="return-due-date-2"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
      cy.get('[data-test="return-due-date-3"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')
      cy.get('[data-test="return-due-date-4"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-4"] > .govuk-tag').contains('complete')
      cy.get('[data-test="return-due-date-5"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-5"] > .govuk-tag').contains('complete')
    })

    // click licence set up tab
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // set the start date to be 2 years in the past
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('01')
    cy.get('#other-start-date-month').type('11')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.startYear

      cy.get('#other-start-date-year').type(startYear - 2)
    })
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#reason-10').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    cy.get('#method').check()
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
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.startYear
      const endYear = currentFinancialYearInfo.year

      cy.get('[data-test="return-due-date-0"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')
      cy.get('[data-test="return-due-date-1"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-1"] > .govuk-tag').contains('due')
      cy.get('[data-test="return-due-date-2"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-2"] > .govuk-tag').contains('void')
      cy.get('[data-test="return-due-date-3"]').contains(`28 April ${endYear}`)
      cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')
      cy.get('[data-test="return-due-date-4"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-4"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-5"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-5"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-6"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-6"] > .govuk-tag').contains('void')
      cy.get('[data-test="return-due-date-7"]').contains(`28 April ${startYear}`)
      cy.get('[data-test="return-status-7"] > .govuk-tag').contains('void')
      cy.get('[data-test="return-due-date-8"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-8"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-9"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-9"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-10"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-10"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-11"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-11"] > .govuk-tag').contains('void')
      cy.get('[data-test="return-due-date-12"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-12"] > .govuk-tag').contains('overdue')
      cy.get('[data-test="return-due-date-13"]').contains(`28 April ${startYear - 1}`)
      cy.get('[data-test="return-status-13"] > .govuk-tag').contains('void')
    })
  })
})
