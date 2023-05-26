'use strict'

describe('Sharing license access with another user (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('external').as('firstUserEmail')
    cy.fixture('users.json').its('externalAccessSharing').as('secondUserEmail')
  })

  it('allows a user to grant access to a licence to another user', () => {
    //  First user logs in
    cy.visit(Cypress.env('externalUrl'))
    cy.get('a[href*="/signin"]').click()
    cy.get('@firstUserEmail').then((email) => {
      cy.get('input#email').type(email)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))
    cy.get('.govuk-button.govuk-button--start').click()

    //  view and assign the licence
    cy.get('.licence-result__column > a').contains('AT/CURR/DAILY/01').should('be.visible')
    cy.get('#navbar-manage').contains('Add licences or give access').click()
    cy.get('.govuk-list').contains('Give or remove access to your licence information').click()
    cy.get('.govuk-button').contains('Give access').click()
    cy.get('@secondUserEmail').then((email) => {
      cy.get('input#email').type(email)
    })
    cy.get('.form > .govuk-button').click()

    // First user logs out
    cy.get('.govuk-link').contains('Return to give access').click()
    cy.get('#signout').click()

    // Second user logs in
    cy.visit(Cypress.env('externalUrl'))
    cy.get('a[href*="/signin"]').click()
    cy.get('@firstUserEmail').then((email) => {
      cy.get('input#email').type(email)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert they can see the same licence
    cy.get('.licence-result__column > a').contains('AT/CURR/DAILY/01').should('be.visible')

    // Sign out
    cy.get('#signout').click()
  })
})
