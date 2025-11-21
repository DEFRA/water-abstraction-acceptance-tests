'use strict'

import scenarioData from '../../../support/scenarios/two-return-requirements-with-points.js'

const scenario = scenarioData()

describe('Submit returns requirement (internal) using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    cy.visit(`/system/licences/${scenario.licences[0].id}/set-up`)

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // choose the licence version start date and click continue
    cy.get('#licenceStartDate').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-heading-l').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#newLicence').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-heading-l').contains('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    cy.get('#useAbstractionData').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the start data and reason options selected previously
    cy.get('[data-test="start-date"]').contains('1 January 2018')
    cy.get('[data-test="reason"]').contains('New licence')

    // confirm we see return requirements generated from abstraction data
    // Return requirement 1
    cy.get('#requirement-0 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 1')
    cy.get('[data-test="purposes-0"]').contains('General Farming & Domestic')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TQ 1234 5678 (Example point 1)')
    cy.get('[data-test="abstraction-period-0"]').contains('From 1 April to 31 March')
    cy.get('[data-test="returns-cycle-0"]').contains('Winter and all year')
    cy.get('[data-test="site-description-0"]').contains('Example point 1')
    cy.get('[data-test="frequency-collected-0"]').contains('Daily')
    cy.get('[data-test="frequency-reported-0"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-0"]').contains('None')

    // Return requirement 2
    cy.get('#requirement-1 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 2')
    cy.get('[data-test="purposes-1"]').contains('Laundry Use')
    cy.get('[data-test="points-1"]').contains('At National Grid Reference TT 9876 5432 (Example point 2)')
    cy.get('[data-test="abstraction-period-1"]').contains('From 1 April to 31 March')
    cy.get('[data-test="returns-cycle-1"]').contains('Winter and all year')
    cy.get('[data-test="site-description-1"]').contains('Example point 2')
    cy.get('[data-test="frequency-collected-1"]').contains('Daily')
    cy.get('[data-test="frequency-reported-1"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-1"]').contains('None')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Licence set up')

    // Confirm we can display the return version details
    cy.get('[data-test="return-version-0').click()

    cy.get('.govuk-heading-l').contains('Requirements for returns for Mr J J Testerson')

    cy.get('[data-test="start-date"]').contains('1 January 2018')
    cy.get('[data-test="reason"]').contains('New licence')

    // Return requirement 1
    cy.get('#requirement-0 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 1')
    cy.get('[data-test="purposes-0"]').contains('General Farming & Domestic')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TQ 1234 5678 (Example point 1)')
    cy.get('[data-test="abstraction-period-0"]').contains('1 April to 31 March')
    cy.get('[data-test="returns-cycle-0"]').contains('Winter and all year')
    cy.get('[data-test="site-description-0"]').contains('Example point 1')
    cy.get('[data-test="frequency-collected-0"]').contains('Daily')
    cy.get('[data-test="frequency-reported-0"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-0"]').contains('None')

    // Return requirement 2
    cy.get('#requirement-1 > div.govuk-summary-card__title-wrapper > h2').contains('Example point 2')
    cy.get('[data-test="purposes-1"]').contains('Laundry Use')
    cy.get('[data-test="points-1"]').contains('At National Grid Reference TT 9876 5432 (Example point 2)')
    cy.get('[data-test="abstraction-period-1"]').contains('1 April to 31 March')
    cy.get('[data-test="returns-cycle-1"]').contains('Winter and all year')
    cy.get('[data-test="site-description-1"]').contains('Example point 2')
    cy.get('[data-test="frequency-collected-1"]').contains('Daily')
    cy.get('[data-test="frequency-reported-1"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-1"]').contains('None')
  })
})
