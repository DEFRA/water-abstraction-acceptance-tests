'use strict'

describe('Submit winter and all year historic correction using abstraction data', () => {
  let year = new Date().getFullYear()
  if (new Date().getMonth() < 4) {
    year = year - 1
  }

  beforeEach(() => {
    cy.tearDown()

    cy.fixture('return-logs-historic-01.json').then((fixture) => {
      for (let i = 0; i < fixture.returnLogs.length; i++) {
        fixture.returnLogs[i].id = `v1:9:AT/CURR/DAILY/01:9999990:${year - i}-04-01:${year + 1 - i}-03-31`
        fixture.returnLogs[i].dueDate = `${year + 1 - i}-04-28`
        fixture.returnLogs[i].endDate = `${year + 1 - i}-03-31`
        fixture.returnLogs[i].startDate = `${year - i}-04-01`
        fixture.returnLogs[i].returnCycleId.value = `${year - i}-04-01`
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
    cy.get('[data-test="return-due-date-0"]').contains(`28 April ${year + 1}`)
    cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-1"]').contains(`28 April ${year}`)
    cy.get('[data-test="return-status-1"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-2"]').contains(`28 April ${year - 1}`)
    cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-3"]').contains(`28 April ${year - 2}`)
    cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-4"]').contains(`28 April ${year - 3}`)
    cy.get('[data-test="return-status-4"] > .govuk-tag').contains('complete')

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
    cy.get('#other-start-date-year').type(year - 2)
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
    cy.get('[data-test="return-due-date-0"]').contains(`28 April ${year + 1}`)
    cy.get('[data-test="return-status-0"] > .govuk-tag').contains('due')
    cy.get('[data-test="return-due-date-1"]').contains(`28 April ${year + 1}`)
    cy.get('[data-test="return-status-1"] > .govuk-tag').contains('void')
    cy.get('[data-test="return-due-date-2"]').contains(`28 April ${year}`)
    cy.get('[data-test="return-status-2"] > .govuk-tag').contains('overdue')
    cy.get('[data-test="return-due-date-3"]').contains(`28 April ${year}`)
    cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')
    cy.get('[data-test="return-due-date-4"]').contains(`28 April ${year - 1}`)
    cy.get('[data-test="return-status-4"] > .govuk-tag').contains('overdue')
    cy.get('[data-test="return-due-date-5"]').contains(`28 April ${year - 1}`)
    cy.get('[data-test="return-status-5"] > .govuk-tag').contains('overdue')
    cy.get('[data-test="return-due-date-6"]').contains(`28 April ${year - 1}`)
    cy.get('[data-test="return-status-6"] > .govuk-tag').contains('void')
    cy.get('[data-test="return-due-date-7"]').contains(`28 April ${year - 2}`)
    cy.get('[data-test="return-status-7"] > .govuk-tag').contains('complete')
    cy.get('[data-test="return-due-date-8"]').contains(`28 April ${year - 3}`)
    cy.get('[data-test="return-status-8"] > .govuk-tag').contains('complete')
  })
})
