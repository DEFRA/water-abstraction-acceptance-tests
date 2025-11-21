'use strict'

import scenarioData from '../../../support/scenarios/licence-with-agreement.js'

const scenario = scenarioData()

describe('End licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('ends a licence agreement using a valid date and check its flags the licence for supplementary billing', () => {
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
    // On the Charge Information tab select to end the licence
    cy.get('[data-test="end-agreement-0"]').click();

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
    cy.get('h1').should('contain.text', 'Licence set up')

    cy.contains('tbody tr', 'Two-part tariff').within(() => {
      cy.get('td').eq(0).should('contain.text', '1 January 2018')
      cy.get('td').eq(1).should('contain.text', '31 March 2022')
      cy.get('td').eq(2).should('contain.text', 'Two-part tariff')
      cy.get('td').eq(3).should('contain.text', '')
      cy.get('td').eq(4).within(() => {
        cy.contains('Delete').should('exist')
        cy.contains('End').should('not.exist')
      })
    })

    // Navigate to back to the Licence summary page
    cy.contains('nav a', 'Licence summary').click();

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
