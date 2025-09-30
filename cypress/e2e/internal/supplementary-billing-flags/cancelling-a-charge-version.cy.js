'use strict'

import cancellingChargeVersion from '../../../support/scenarios/cancelling-charge-version.js'

const cancellingChargeVersionScenario = cancellingChargeVersion()

describe('Cancelling a charge version in workflow (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(cancellingChargeVersionScenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('flags the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    /// Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm there are no flags already on the licence
    cy.get('.govuk-notification-banner__content').should('not.exist')

    // Click the workflow tab
    cy.get('#nav-manage').click()
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
