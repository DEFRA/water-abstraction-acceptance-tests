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

    cy.visit(`/system/licences/${scenario.licences[0].id}/summary`)

    // Check there are no notification banners present initially
    cy.get('.govuk-notification-banner__content').should('not.exist')

    // Navigate to the Licence set up page
    cy.contains('nav a', 'Licence set up').click()
    cy.get('h1').should('contain.text', 'Licence set up')

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
    cy.get('h1').should('contain.text', 'Licence set up')

    cy.contains('tbody tr', '1 April 2018').within(() => {
      cy.get('td').eq(0).should('contain.text', '1 April 2018') // start date
      cy.get('td').eq(1).should('contain.text', '') // end date
      cy.get('td').eq(2).should('contain.text', 'Two-part tariff')// agreement
      cy.get('td').eq(3).should('contain.text', '') // date signed

      cy.get('td').eq(4).within(() => { // actions
        cy.contains('Delete').should('exist')
        cy.contains('End').should('exist')
      })
    })

    // Navigate to back to the Licence summary page
    cy.contains('nav a', 'Licence summary').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
