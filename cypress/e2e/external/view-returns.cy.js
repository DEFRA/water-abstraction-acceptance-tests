'use strict'

describe('View returns (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      const futureDate = new Date()
      const additionalMonths = 3

      futureDate.setMonth(futureDate.getMonth() + additionalMonths)

      fixture.returnLogs[2].dueDate = futureDate.toISOString()
      cy.load(fixture)
    })

    cy.fixture('external-user.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('loadedExternal').as('userEmail')
  })

  it('login as an existing user and view returns', () => {
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

    // Select a licence to view returns and their status
    cy.contains('AT/CURR/MONTHLY/02').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')
    cy.get('.govuk-tag').should('be.visible').and('contain.text', 'Due')
    cy.get('.govuk-tag').should('be.visible').and('contain.text', 'Overdue')
    cy.get('.govuk-tag').should('be.visible').and('contain.text', 'Complete')
    cy.get('.govuk-tag').should('be.visible').and('contain.text', 'Overdue')
  })
})
