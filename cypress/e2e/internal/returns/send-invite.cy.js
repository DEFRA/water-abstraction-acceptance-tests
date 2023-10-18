'use strict'

// TODO: remove skip() once the licence NW/072/0417/002/R01\r has been fixed
describe.skip('Send returns invite to customer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('invites a customer to submit returns', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // assert the user signed in and we're on the search page
    cy.contains('Search')

    // navigate to the invitations flow
    cy.get('#navbar-notifications').click()
    cy.get('a[href="/returns-notifications/invitations"]').click()

    // Send returns invitations
    // just click continue. The page is for submitting licences to be excluded which this test doesn't cover
    cy.get('form > .govuk-button').click()

    // Send returns invitations
    // spinner page appears here. Because this takes some time we need to amend the timeout in the next command
    cy.get('h1').contains('Send returns invitations')
    cy.get('.govuk-button').contains('Send', { timeout: 20000 }).click()

    // Return invitations sent
    cy.get('.govuk-panel__title').should('contain', 'Return invitations sent')
    cy.get('p > a').contains('View report').should('be.visible').click()

    // Returns: invitation
    // it can take some time to generate the report hence the extra timeout
    cy.get('h1').contains('Notification report', { timeout: 20000 })
  })
})
