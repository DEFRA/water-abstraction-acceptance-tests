'use strict'

describe('End licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('licence-agreement').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('ends a licence agreement using a valid date and check its flags the licence for supplementary billing', () => {
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

    // Charge information
    // back on the Charge Information tab select to end the licence
    cy.get('#set-up').should('be.visible')
    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row > :nth-child(5)').contains('End').click()

    // Set agreement end date
    // first check the validation for invalid dates is working
    cy.get('#endDate-day').type('01')
    cy.get('#endDate-month').type('01')
    cy.get('#endDate-year').type('2021')
    cy.get('form > .govuk-button').click()
    cy.get('.govuk-error-summary').contains('You must enter an end date that matches some existing charge information or is 31 March.You cannot use a date that is before the agreement start date.').should('be.visible')

    // then repeat using a valid date
    cy.get('#endDate-day').clear().type('31')
    cy.get('#endDate-month').clear().type('03')
    cy.get('#endDate-year').clear().type('2022')
    cy.get('form > .govuk-button').click()

    // You're about to end this agreement
    // confirm the details match what was entered and continue
    cy.get('#main-content > table > tbody > tr').within(() => {
      // agreement
      cy.get('td:nth-child(1)').should('contain.text', 'Two-part tariff')
      // date signed
      cy.get('td:nth-child(2)').should('contain.text', ' ')
      // start date
      cy.get('td:nth-child(3)').should('contain.text', '1 January 2018')
      // end date
      cy.get('td:nth-child(4)').should('contain.text', '31 March 2022')
    })
    cy.get('form > .govuk-button').contains('End agreement').click()

    // Charge information
    // confirm we are back on the licence set up tab and our licence agreement is present with an end date and only
    // the delete action available
    cy.get('#set-up').should('be.visible')

    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row').within(() => {
      // start date
      cy.get(':nth-child(1)').should('contain.text', '1 January 2018')
      // end date
      cy.get(':nth-child(2)').should('contain.text', '31 March 2022')
      // agreement
      cy.get(':nth-child(3)').should('contain.text', 'Two-part tariff')
      // date signed
      cy.get(':nth-child(4)').should('contain.text', '')
      // actions
      cy.get(':nth-child(5) > a:nth-child(1)').should('contain.text', 'Delete')
      cy.get(':nth-child(5) > a:nth-child(2)').should('not.exist')
    })

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
