'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-presroc-chg-ver.js'

const scenario = scenarioData()

describe('PRESROC licence transfer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('adds a new charge information which transfers the licence to a new billing account with new address and FAO contact then approves it and confirms licence is flagged for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/set-up`)

    // Confirm we are on the licence set-up page and then click Set up a new charge
    cy.contains('Licence set up')
    cy.contains('Set up a new charge').click()

    // Select reason for new charge information
    // choose Licence transferred and now chargeable and continue
    cy.get('input#reason-7').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set charge start date
    // choose Licence version start date and continue
    cy.get('input#startDate-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Who should the bills go to?
    // choose Another billing contact then enter a name to search for and continue
    cy.get('input#account-2').click()
    cy.get('input#accountSearch').type('Test Farm Co Ltd')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the account type
    // choose Individual and then enter a name and continue. We choose an individual because Company requires a
    // valid company's house number
    cy.get('input#accountType-3').click()
    cy.get('input#personName').type('Test Farm Co Ltd')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select an existing address for Big Farm Co Ltd
    // choose existing address Big Farm and continue (we already have journeys that use the address lookup so no need to
    // repeat here)
    cy.get('input#selectedAddress').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do you need to add an FAO?
    // choose Yes and continue
    cy.get('input#faoRequired').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set up a contact
    // choose Add a new department and continue
    cy.get('input#selectedContact-2').click()
    cy.get('input#department').type('Test Farm Manager')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check billing account details
    // check the details are as expected and confirm
    cy.get('section > dl').within(() => {
      cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Test Farm Co Ltd')
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Test Farm Manager')
    })
    cy.get('form > .govuk-button').contains('Confirm').click()

    // Use abstraction data to set up the element?
    // choose Yes and continue
    cy.get('input#useAbstractionData-4').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // check the charge details and element details are as expected and then confirm
    cy.get('section:nth-child(1) > dl').within(() => {
      // reason
      cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Licence transferred and now chargeable')
      // start date
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', '1 January 2018')
      // billing account
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Test Farm Co Ltd')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Test Farm Manager')
      // licence holder
      cy.get('div:nth-child(4) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm Co Ltd')
    })
    cy.get('form > section > h2').should('contain.text', 'Element')
    cy.get('form > section > dl').within(() => {
      // abstraction period
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', '1 April to 31 March')
      // annual quantities
      cy.get('div:nth-child(4) > dd.govuk-summary-list__value').should('contain.text', '15.54ML authorised')
      // time limit
      cy.get('div:nth-child(5) > dd.govuk-summary-list__value').should('contain.text', 'No')
      // source
      cy.get('div:nth-child(6) > dd.govuk-summary-list__value').should('contain.text', 'Unsupported')
      // season
      cy.get('div:nth-child(7) > dd.govuk-summary-list__value').should('contain.text', 'All Year')
      // loss
      cy.get('div:nth-child(8) > dd.govuk-summary-list__value').should('contain.text', 'Medium')
      // environmental improvement unit charge
      cy.get('div:nth-child(9) > dd.govuk-summary-list__value').should('contain.text', 'Other')
    })
    cy.get('form > .govuk-button').contains('Confirm').click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    cy.get('.govuk-panel__title').should('contain', 'Charge information complete')
    cy.get('a[href*="licences/"]').contains('View charge information').click()

    // Charge information
    // select to review it
    cy.contains('Review').click()

    // Check charge information
    // approve the new charge version
    cy.get('strong.govuk-tag--orange').should('contain.text', 'Review')
    cy.get('input#reviewOutcome').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    cy.contains('Review').should('not.exist')

    // Navigate to the Licence summary page
    cy.contains('nav a', 'Licence summary').click()

    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
