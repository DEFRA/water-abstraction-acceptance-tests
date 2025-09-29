'use strict'

import sharingAccess from '../../../support/scenarios/sharing-access.js'

const sharingAccessScenario = sharingAccess()

describe('Sharing license access with another user (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.load(sharingAccessScenario)
    cy.wrap(sharingAccessScenario.users[0].username).as('firstUserEmail')
    cy.wrap(sharingAccessScenario.users[1].username).as('secondUserEmail')
  })

  it('allows a user to grant access to a licence to another user', () => {
    //  First user logs in
    cy.get('@firstUserEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/manage_licences`)

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
    cy.get('@secondUserEmail').then((email) => {
      cy.get('input#email').type(email)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert they can see the same licence
    cy.get('.licence-result__column > a').contains('AT/CURR/DAILY/01').should('be.visible')
  })
})
