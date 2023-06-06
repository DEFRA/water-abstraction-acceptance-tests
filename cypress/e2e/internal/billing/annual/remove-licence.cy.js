'use strict'

describe('Remove bill from annual bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates an SROC annual bill run but before it is sent removes a single bill and confirms it is not included', () => {
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

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Annual and continue
    cy.get('input#selectedBillingType').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Annual bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')

    // Test Region annual bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm we have 4 bills then click to view the first one
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£2,171.00')
    cy.get('div#water-companies > table > tbody > tr').should('have.length', 4)
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(5)').contains('View').click()

    // Bill for Big Farm Co Ltd 04
    // click the Remove bill
    cy.get('.govuk-grid-column-two-thirds > .govuk-button').contains('Remove bill').click()

    // You're about to remove this bill from the annual bill run
    // confirm we are on the remove bill confirmation page and then click Remove this bill
    cy.get('.govuk-heading-l')
      .should('contain.text', "You're about to remove this bill from the annual bill run")
    cy.get(':nth-child(1) > :nth-child(1) > p')
      .should('contain.text', 'The licence will go into the next supplementary bill run.')
    cy.get('form > .govuk-button').contains('Remove this bill').click()

    // Test Region Annual bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')

    // Test Region annual bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm we're down to 3 bills
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£291.00')
    cy.get('div#water-companies > table > tbody > tr').should('have.length', 3)
  })
})
