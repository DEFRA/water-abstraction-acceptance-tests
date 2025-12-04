'use strict'

import scenarioData from '../../../support/scenarios/licence-with-agreement.js'

const scenario = scenarioData()

describe('Recalculate Bills Link (internal)', () => {
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
    cy.visit(`/system/licences/${scenario.licences[0].id}/set-up`)

    // Click the recalculate bills link
    cy.contains('a.govuk-button', 'Recalculate bills').click()
    cy.get('.govuk-caption-l').contains('AT/TE/ST/01/01').click()
    cy.get('[data-test="sroc-years-2024"]').click()
    cy.get('[data-test="pre-sroc-years"]').click()
    cy.get('.govuk-button').click()

    // You've marked this licence for the next supplementary bill run
    // confirm we see the success panel and then click the link to return to the licence
    cy.get('.govuk-panel').should('contain.text', "You've marked this licence for the next supplementary bill run")
    cy.get('.govuk-body > .govuk-link').click()

    // Navigate to back to the Licence summary page
    cy.contains('nav a', 'Licence summary').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run for the old charge scheme.')
  })
})
