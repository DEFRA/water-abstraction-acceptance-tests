'use strict'

import scenarioData from '../../../support/scenarios/delete-licence-from-workflow.js'

const scenario = scenarioData()

describe('Deleting a licence from workflow (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('flags the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm there are no flags already on the licence
    cy.get('.govuk-notification-banner__content').should('not.exist')

    // Navigate to the manage page
    cy.get('#nav-manage').click()

    // Click on the workflow link
    cy.get('a[href="/charge-information-workflow"]').click()

    // Workflow
    // confirm the 3 tabs exist
    cy.get('#tab_toSetUp').should('contain.text', 'To set up')
    cy.get('#tab_review').should('contain.text', 'Review')
    cy.get('#tab_changeRequest').should('contain.text', 'Change request')

    // confirm we see our test licence in the 'To set up' workflow and the correct action links
    cy.get('#toSetUp > div > table > tbody').within(() => {
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'AT/CURR/DAILY/01')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Big Farm Co Ltd')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', '1 January 2020')

      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Set up')
      cy.get('.govuk-table__row:nth-child(1)').should('contain.text', 'Remove')

      cy.get('.govuk-table__row:nth-child(1) > td:nth-child(4) > a:nth-child(2)').click()
    })

    // Remove licence from workflow
    cy.get('.govuk-heading-xl').contains("You're about to remove this licence from the workflow")
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(1)').contains('AT/CURR/DAILY/01')
    cy.get('form > .govuk-button').click()

    // Assert there are no licences in workflow now
    cy.get('#toSetUp > :nth-child(1) > .govuk-caption-m').contains('There are no licences that require charge information setup.')

    // search for a licence
    cy.get('#navbar-view').click()
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run.')
  })
})
