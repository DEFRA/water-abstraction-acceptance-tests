'use strict'

describe('Remove charge information journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('barebones.json').then((fixture) => {
      fixture.licences[0].waterUndertaker = false
      cy.load(fixture)
    })

    cy.fixture('charge-version-workflow.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('removes a charge information from the workflow', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // assert the user signed in and we're on the search page
    cy.get('#main-content > form > fieldset > legend > h1 > label').should('contain.text', 'Search')

    // navigate to the charge information flow
    cy.get('#navbar-notifications').click()
    cy.get('a[href="/charge-information-workflow"]').click()

    // Charge information workflow
    // confirm the 3 tabs exist
    cy.get('#tab_toSetUp').should('contain.text', 'To set up')
    cy.get('#tab_review').should('contain.text', 'Review')
    cy.get('#tab_changeRequest').should('contain.text', 'Change request')

    // confirm we see our test licence in the 'To set up' workflow and the correct action links
    cy.get('#toSetUp > div > table > tbody').within(() => {
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'AT/CURR/DAILY/01')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Big Farm Co Ltd')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', '1 January 2020')

      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Set up')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Remove')

      cy.get('.govuk-table__row:nth-child(1) > td:nth-child(4) > a:nth-child(2)').click()
    })

    // You're about to remove this licence from the workflow
    // confirm we are on the right page and seeing the right information then click the Remove button
    cy.get('.govuk-heading-xl').should('contain.text', "You're about to remove this licence from the workflow")
    cy.get('.govuk-table__body').within(() => {
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'AT/CURR/DAILY/01')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Big Farm Co Ltd')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', '1 January 2020')
    })
    cy.get('button.govuk-button').click()

    // Charge information workflow
    // confirm the charge information has been removed
    cy.get('#toSetUp > div > div').should('contain.text', 'There are no licences that require charge information setup.')
  })
})
