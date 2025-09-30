'use strict'

describe('Creating a user (internal)', () => {
  beforeEach(() => {
    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can create an internal user', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the manage page
    cy.visit('/system/manage')

    // Click on the create user link
    cy.get(':nth-child(11) > li > .govuk-link').click()

    // Enter a generated email address to avoid duplicates on subsequent runs of the test
    cy.wrap(`regression.tests.${Date.now()}@defra.gov.uk`).as('newEmail')

    cy.get('@newEmail').then((newEmail) => {
      cy.get('.govuk-label').should('contain.text', 'Enter a gov.uk email address')
      cy.get('input#email').type(newEmail)
      cy.get('form > .govuk-button').click()

      // Confirm we see 8 permission types. Then pick one for our user
      cy.get('div.govuk-radios').children().should('have.length', 8)
      cy.get('[type="radio"]').check('basic')
      cy.get('form > .govuk-button').click()

      // Confirm we see confirmation of the new account created
      cy.get('h1.govuk-heading-l').should('contain.text', 'New account created')
      cy.get("span[class='govuk-!-font-weight-bold']").should('contain.text', newEmail)
    })
  })
})
