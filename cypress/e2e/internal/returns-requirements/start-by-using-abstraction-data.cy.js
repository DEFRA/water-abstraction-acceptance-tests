'use strict'

describe('Submit returns requirement (internal) using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('returns-requirements.json').then((fixture) => {
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
    cy.get('#query').type('AT/TEST/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page and select licence set up tab
    cy.contains('AT/TEST/01')
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#reason-10').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    cy.get('#setup').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the start data and reason options selected previously
    cy.get('[data-test="start-date"]').contains('12 June 2023')
    cy.get('[data-test="reason"]').contains('New licence')

    // confirm we see return requirements generated from abstraction data
    // Return requirement 1
    cy.get('#requirement-0 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 1')
    cy.get('[data-test="purposes-0"]').contains('Hydroelectric Power Generation')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TQ 1234 5678 (Example point 1)')
    cy.get('[data-test="abstraction-period-0"]').contains('From 1 March to 31 December')
    cy.get('[data-test="returns-cycle-0"]').contains('Winter and all year')
    cy.get('[data-test="site-description-0"]').contains('Example point 1')
    cy.get('[data-test="frequency-collected-0"]').contains('Daily')
    cy.get('[data-test="frequency-reported-0"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-0"]').contains('None')

    // Return requirement 2
    cy.get('#requirement-1 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 2')
    cy.get('[data-test="purposes-1"]').contains('Laundry Use')
    cy.get('[data-test="points-1"]').contains('At National Grid Reference TT 9876 5432 (Example point 2)')
    cy.get('[data-test="abstraction-period-1"]').contains('From 12 June to 29 November')
    cy.get('[data-test="returns-cycle-1"]').contains('Winter and all year')
    cy.get('[data-test="site-description-1"]').contains('Example point 2')
    cy.get('[data-test="frequency-collected-1"]').contains('Monthly')
    cy.get('[data-test="frequency-reported-1"]').contains('Monthly')
    cy.get('[data-test="agreements-exceptions-1"]').contains('None')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')
  })
})
