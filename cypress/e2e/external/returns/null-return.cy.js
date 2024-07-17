'use strict'

describe('Submit null return (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('login as an existing user and submit returns', () => {
    cy.visit(Cypress.env('externalUrl'))

    // tap the sign in button on the welcome page
    cy.get('a[href*="/signin"]').click()

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Select a licence to submit returns for
    cy.contains('AT/CURR/MONTHLY/02').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')

    // Start the return journey - return reference 9999990
    cy.get(':nth-child(4) > [scope="row"] > a').click()

    // --> Have you extracted water in this period?
    // Click 'No' and continue
    cy.get('input[value="true"]').check()
    cy.get('form>.govuk-button').click()

    // Confirm and submit the details
    cy.get('h2.govuk-heading-l').should('contain.text', 'Nil return')
    cy.get('form>.govuk-button').click()

    // Confirm Return submitted
    cy.get('.panel__title').should('contain.text', 'Return submitted')
  })
})
