'use strict'

describe('Cancelling a charge version in workflow (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('cancelling-a-charge-version.json').then((fixture) => {
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

    // Search the licence
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm there are no flags already on the licence
    cy.get('.govuk-notification-banner__content').should('not.exist')

    // Click the workflow tab
    cy.get('#nav-manage').click()
    cy.get('#navbar-notifications').click()
    cy.get(':nth-child(9) > li > .govuk-link').click()
    cy.get('#tab_review').click()

    // Check licences in workflow
    cy.contains('Workflow')
    cy.get('#review > div > .govuk-table > tbody > .govuk-table__row > :nth-child(1)').contains('AT/CURR/DAILY/01')
    cy.get('#review > div > .govuk-table > tbody > .govuk-table__row > :nth-child(2)').contains('Big Farm Co Ltd')
    cy.get('#review > div > .govuk-table > tbody > .govuk-table__row > :nth-child(3)').contains('billing.data@wrls.gov.uk')
    cy.get('#review > div > .govuk-table > tbody > .govuk-table__row > :nth-child(4)').contains('1 January 2020')

    // Check we are cancelling the correct charge version
    cy.get('.govuk-table__row > :nth-child(5) > a').click()
    cy.contains('Check charge information')
    cy.get('.govuk-caption-l').contains('Licence AT/CURR/DAILY/01')
    cy.get('.govuk-grid-column-full > .govuk-heading-l').contains('Do you want to approve this charge information?')

    // Cancel charge version
    cy.get('.govuk-grid-column-full > form > .govuk-button').click()
    cy.get('.govuk-caption-l').contains('Licence AT/CURR/DAILY/01')
    cy.get('.govuk-heading-l').contains("You're about to cancel this charge information")
    cy.get('form > .govuk-button').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run.')
  })
})
