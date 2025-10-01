'use strict'

import scenarioData from '../../../support/scenarios/one-licence-only.js'

const scenario = scenarioData()

describe('New licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('setup a new agreement for a license and then view it', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/set-up`)

    // Confirm we are on the tab page and then click Set up a new agreement
    cy.contains('Charge information')
    cy.contains('Set up a new agreement').click()

    // Select agreement
    // select Two-part tariff then continue
    cy.get('.govuk-radios > :nth-child(1) > #financialAgreementCode').check()
    cy.get('form > .govuk-button').click()

    // Do you know the date the agreement was signed?
    // select No and continue
    cy.get('#isDateSignedKnown-2').check()
    cy.get('form > .govuk-button').click()

    // Check agreement start date
    // select Yes to set a different agreement start date. A section appears allowing the user to enter the custom
    // date then continue
    cy.get('input#isCustomStartDate').check()
    cy.get('#startDate-day').type('01')
    cy.get('#startDate-month').type('04')
    cy.get('#startDate-year').type('2018')
    cy.get('form > .govuk-button').click()

    // Check agreement details
    // confirm the details match what was entered and continue
    cy.get('.govuk-heading-l').contains('Check agreement details').should('be.visible')
    cy.get('.govuk-summary-list__value').contains('Two-part tariff').should('be.visible')
    cy.get('form > .govuk-button').click()

    // Charge information
    // confirm we are back on the Charge Information tab and our licence agreement is present
    cy.get('#set-up').should('be.visible')

    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row').within(() => {
      // start date
      cy.get(':nth-child(1)').should('contain.text', '1 April 2018')
      // end date
      cy.get(':nth-child(2)').should('contain.text', '')
      // agreement
      cy.get(':nth-child(3)').should('contain.text', 'Two-part tariff')
      // date signed
      cy.get(':nth-child(4)').should('contain.text', '')
      // actions
      cy.get(':nth-child(5) > a:nth-child(1)').should('contain.text', 'Delete')
      cy.get(':nth-child(5) > a:nth-child(2)').should('contain.text', 'End')
    })

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
