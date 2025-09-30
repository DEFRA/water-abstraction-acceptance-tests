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

    // Click the workflow tab
    cy.get('#nav-manage').click()

    // Check licences in workflow
    cy.get(':nth-child(9) > li > .govuk-link').click()
    cy.contains('Workflow')
    cy.get('tbody > .govuk-table__row > :nth-child(1)').contains('AT/CURR/DAILY/01')
    cy.get('tbody > .govuk-table__row > :nth-child(2)').contains('Big Farm Co Ltd')
    cy.get('tbody > .govuk-table__row > :nth-child(3)').contains('1 January 2020')

    // Remove licence from workflow
    cy.get('tbody > .govuk-table__row > :nth-child(4)').contains('Remove').click()
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
