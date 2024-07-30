'use strict'

describe('Paper returns validation (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('generates a paper form sent by Notify to the licensee', () => {
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

    // Navigate to the paper returns flow
    cy.get('#navbar-notifications').click()
    cy.get('.govuk-heading-l').should('contain.text', 'Manage reports and notices')
    cy.get('ul.govuk-list').eq(1).should('contain.text', 'Paper forms')
    cy.get('a[href="/returns-notifications/forms"]').click()

    // Select a licence to generate paper returns for
    // Enter a licence number page
    cy.get('label.govuk-label').should('contain.text', 'Enter a licence number')
    cy.get('#licenceNumbers').should('be.visible')
    cy.get('button.govuk-button').should('contain.text', 'Continue')

    // Enter an invalid licence number
    cy.get('#licenceNumbers').type('INCORRECT/TEST/LICENCE/NUMBER')
    cy.get('button.govuk-button').click()
    cy.get('.govuk-error-summary').should('be.visible')
    cy.get('.govuk-error-summary__title').should('contain.text', 'There is a problem')
    cy.get('.govuk-error-summary__body').should('contain.text', 'The licence number INCORRECT/TEST/LICENCE/NUMBER could not be found')

    // Enter a licence that does not have any returns due
    cy.get('#licenceNumbers').clear()
    cy.get('#licenceNumbers').type('AT/CURR/MONTHLY/01')
    cy.get('button.govuk-button').click()
    cy.get('label.govuk-label').should('contain.text', 'Enter a licence number')
    cy.get('.govuk-notification-banner__heading').contains('There are no returns due for licence AT/CURR/MONTHLY/01')

    // Enter 2 licences; one with returns due and one without
    cy.get('#licenceNumbers').clear()
    cy.get('#licenceNumbers').type('AT/CURR/MONTHLY/02, AT/CURR/MONTHLY/01')
    cy.get('button.govuk-button').click()
    cy.get('.govuk-notification-banner__heading').contains('There are no returns due for licence AT/CURR/MONTHLY/01')

    cy.get('div.govuk-summary-list__row').eq(0).should('contain.text', 'Licence holder')
    cy.get('div.govuk-summary-list__row').eq(0).children(1).should('contain.text', 'Big Farm Co Ltd')
    cy.get('div.govuk-summary-list__row').eq(1).contains('Returns reference number')
    cy.get('div.govuk-summary-list__row').eq(1).children(3).should('contain.text', 'Change')

    cy.get('div.govuk-summary-list__row').eq(2).contains('Address')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).should('contain.text', 'Big Farm Co Ltd')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Big Farm')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Windy road')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Buttercup meadow')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Buttercup Village')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Testington')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('TT1 1TT')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('UK')

    // Select a return
    cy.get('a[href*="select-returns"]').click()

    // Select the first return
    cy.get('#returnIds').check()
    cy.get('button.govuk-button').click()
    cy.get('.meta__key').contains('9999990')
    cy.get('.meta__value').contains('Due 28 January 2020')
    cy.get(':nth-child(2) > .govuk-summary-list__value').should('have.length', '1')

    // Go back, uncheck it and select the second one
    cy.get('a[href*="select-returns"]').click()
    cy.get('input[id="returnIds"]').uncheck()
    cy.get('input[id="returnIds-2"]').check()
    cy.get('button.govuk-button').click()
    cy.get('.meta__key').contains('9999991')
    cy.get('.meta__value').contains('Due 28 January 2021')
    cy.get(':nth-child(2) > .govuk-summary-list__value').should('have.length', '1')

    // Send the paper form
    cy.get('button.govuk-button').contains('Send paper forms').click()

    // Paper return forms sent
    cy.get('.govuk-panel__title', { timeout: 10000 }).contains('Paper return forms sent')
    cy.get('.govuk-panel__body').contains('They will arrive in three to five working days')
  })
})
