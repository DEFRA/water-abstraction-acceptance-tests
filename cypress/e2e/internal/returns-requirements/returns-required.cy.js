'use strict'

describe('Submit and cancel no returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-current')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a no returns requirement and approves the requirement', () => {
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
    cy.get('#query').type('AT/SROC/SUPB/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page and select charge information tab
    cy.contains('AT/SROC/SUPB/01')
    cy.get('#tab_charge').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')

    // click set up new returns requirement
    cy.get('[data-test="meta-data-returns-required"]').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.get('.govuk-button').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.get('.govuk-button').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // click set up manually and continue
    cy.get('#setup-3').check()
    cy.get('.govuk-button').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement
  })
})
