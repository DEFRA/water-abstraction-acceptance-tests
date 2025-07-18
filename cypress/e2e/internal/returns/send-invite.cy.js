'use strict'

describe('Send returns invite to customer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
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
    cy.get('a[href="/system/notices/setup/standard?noticeType=invitations"]').click()

    // Select the returns periods for the standard
    // Select the first radio button and continue
    cy.get('[type="radio"]').first().check()
    cy.get('form > .govuk-button').click()

    // Check the recipients
    cy.get('h1').contains('Check the recipients')
    cy.get('.govuk-button').contains('Send').click()

    // Returns invitations sent
    cy.get('.govuk-panel__title').should('contain', 'Returns invitations sent')
    cy.get('p > a').contains('View notifications report').should('be.visible').click()

    // Returns: invitation
    cy.get('h1').contains('Notification report')
  })
})
