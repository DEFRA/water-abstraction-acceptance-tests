'use strict'

describe('Login and log out (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
    cy.fixture('users.json').its('environmentOfficer').as('userToBeUpdatedEmail')
  })

  it('can log in and out as an internal user', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // search for the user by email
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('#query').type(userToBeUpdatedEmail)
    })
    cy.get('.search__button').click()

    // confirm we see the expected result then select it
    cy.get('.govuk-grid-column-full > .govuk-heading-m').should('have.text', 'Users')
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('.govuk-list > li').should('contain.text', userToBeUpdatedEmail)
    })
    cy.get('.govuk-list .govuk-link').click()

    // Set permissions
    // confirm we are on the permissions page then change the user's permissions from environment officer to National
    // Permitting Service and submit
    cy.get('.govuk-heading-l').eq(1).should('have.text', 'Set permissions')
    cy.get('#permission-3').should('be.checked')
    cy.get('#permission-4').check()
    cy.get('form > .govuk-button').click()

    // Account permissions are updated
    // confirm we see the confirmation page and what permissions have now been applied
    cy.get('.govuk-heading-l').should('contain.text', 'Account permissions are updated')
    cy.get('p.govuk-body').eq(1).should('contain', 'National Permitting Service permissions')
  })
})
