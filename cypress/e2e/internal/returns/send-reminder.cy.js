'use strict'

describe('Send returns reminder to customer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('reminds a customer to submit returns', () => {
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

    // navigate to the reminders flow
    cy.get('#navbar-notifications').click()
    cy.get('a[href="/returns-notifications/reminders"]').click()

    // Send returns reminders
    // just click continue. The page is for submitting licences to be excluded which this test doesn't cover
    cy.get('form > .govuk-button').click()

    // Send returns reminders
    // spinner page appears here. Because this takes some time we need to amend the timeout in the next command
    cy.get('h1').contains('Send returns reminders')
    cy.get('.govuk-button').contains('Send', { timeout: 40000 }).click()

    // Return reminders sent
    cy.get('.govuk-panel__title').should('contain', 'Return reminders sent')
    cy.get('p > a').contains('View report').should('be.visible').click()

    // Returns: reminder
    // it can take some time to generate the report hence the extra timeout
    cy.get('h1').contains('Notification report', { timeout: 40000 })
  })
})
