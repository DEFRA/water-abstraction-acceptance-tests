'use strict'

describe('Recalculate Bills Link (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('recalculate-bills-link.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('flags the licence for supplementary billing', () => {
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

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()
    cy.contains('Licence set up').click()

    // Click the recalculate bills link
    cy.get('#set-up > div > .govuk-button').click()
    cy.get('.govuk-caption-l').contains('AT/CURR/DAILY/01').click()
    cy.get('[data-test="sroc-years-2024"]').click()
    cy.get('[data-test="pre-sroc-years"]').click()
    cy.get('.govuk-button').click()

    // You've marked this licence for the next supplementary bill run
    // confirm we see the success panel and then click the link to return to the licence
    cy.get('.govuk-panel').should('contain.text', "You've marked this licence for the next supplementary bill run")
    cy.get(':nth-child(4) > .govuk-link').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run for the old charge scheme.')
  })
})
