'use strict'

describe('Create and send supplementary bill runs (internal)', () => {
  beforeEach(() => {
    // cy.tearDown()
    // cy.setUp('sroc-billing-current')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends them', () => {
    cy.visit('/')

    cy.get('@userEmail').then((userEmail) => {
      cy.get('#email').type(userEmail)
    })

    cy.get('#password').type(Cypress.env('defaultPassword'))

    cy.get('form > .govuk-button').click()

    cy.contains('Search')

    cy.get('#query').type('AT/SROC/SUPB/01')

    cy.get('.search__button').click()

    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page and select charge information tab
    cy.contains('AT/SROC/SUPB/01')
    cy.get('#tab_charge').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')

    // click the no returns required button
    cy.get('[href="/system/licences/3c28f53e-22ad-4c20-aa42-2db9909b9e21/no-returns-required"]').click()

    // confirm we are on the start date page
    cy.get('.govuk-fieldset__heading').contains('start date')

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.get('.govuk-button').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-fieldset__heading').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.get('.govuk-button').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we are seeing the details we selected
    // cy.get(':nth-child(2) > .govuk-summary-list.govuk-\!-margin-bottom-2 > :nth-child(1) > .govuk-summary-list__value').should('contain.text', '1 January 2022')
  })
})
