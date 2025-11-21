'use strict'

import scenarioData from '../../../support/scenarios/licence-with-agreement.js'

const scenario = scenarioData()

describe('Delete licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('deletes a licence agreement and check its flags the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    cy.visit(`/system/licences/${scenario.licences[0].id}/summary`)

    // Check there are no notification banners present initially
    cy.get('.govuk-notification-banner__content').should('not.exist')


    // Navigate to the Licence set up page
    cy.contains('nav a', 'Licence set up').click();
    cy.get('h1').should('contain.text', 'Licence set up')

    // Charge information
    // On the Licence set up page select to delete the licence
    cy.contains('Delete').click()

    // You're about to delete this agreement
    // confirm we are on the right page and it is showing the right agreement then delete it
    cy.get('.govuk-heading-l').contains("You're about to delete this agreement")

    cy.get('#main-content > table > tbody > tr').within(() => {
      // agreement
      cy.get('td:nth-child(1)').should('contain.text', 'Two-part tariff')
      // date signed
      cy.get('td:nth-child(2)').should('contain.text', ' ')
      // start date
      cy.get('td:nth-child(3)').should('contain.text', '1 January 2018')
      // end date
      cy.get('td:nth-child(4)').should('contain.text', ' ')
    })
    cy.contains('Delete agreement').click()

    // Charge information
    // confirm we are back on the Charge Information tab and our licence agreement is no longer present
    // cy.get('#set-up').should('be.visible')
    cy.contains('No agreements for this licence.')

    // Navigate to back to the Licence summary page
    cy.contains('nav a', 'Licence summary').click();

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
