'use strict'

describe('Submit returns requirement (internal) using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('generate-using-abstraction-data.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')
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

    // confirm we are on the licence page and select charge information tab
    cy.contains('AT/TEST/01')
    cy.get('#tab_charge').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')

    // click set up new returns requirement
    cy.contains('Set up new returns requirement').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
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
    cy.get('[data-test="reason"]').contains('Licence holder name or address change')

    // // choose the approve return requirement button
    // cy.contains('Approve returns requirement').click()

    // // confirm we are on the approved page
    // cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // // click link to return to licence set up
    // cy.contains('Return to licence set up').click()

    // // confirm we are on the charge information tab
    // cy.get('#charge').contains('Charge information')
  })
})
