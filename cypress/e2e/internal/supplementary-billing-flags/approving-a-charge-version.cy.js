'use strict'

describe('SROC charge information journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('approving-a-charge-version-supplementary-flags.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('adds a new charge information with a new billing account, note and charge element then sets up the charge reference including additional charges and adjustments and then approves it and confirms licence is flagged for supplementary billing', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm we are on the licence page and select the licence set up tab
    cy.contains('AT/CURR/DAILY/01')
    cy.contains('Licence set up').click()

    // Confirm we are on the tab page and then click Set up a new charge
    cy.contains('Charge information')
    cy.contains('Set up a new charge').click()

    // Select reason for new charge information
    // choose Strategic review of charges (SRoC) and continue
    cy.get('input#reason-12').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set charge start date
    // choose another date and then enter 2022-06-01 and continue
    cy.get('input#startDate-4').click()
    cy.get('#customDate-day').type('1')
    cy.get('#customDate-month').type('6')
    cy.get('#customDate-year').type('2022')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Who should the bills go to?
    // the existing account is automatically selected so just continue
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select an existing address for Big Farm Co Ltd
    // choose the existing address and continue
    cy.get('input#selectedAddress').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do you need to add an FAO?
    // choose No and continue
    cy.get('input#faoRequired-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check billing account details
    // confirm
    cy.get('form > .govuk-button').contains('Confirm').click()

    // Use abstraction data to set up the element?
    // choose Use charge information valid from 1 June 2022 and continue
    cy.get('input#useAbstractionData-4').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // set the charge reference
    cy.get('button[value="addChargeCategory"]').click()

    // Enter a description for the charge reference
    // enter a description and continue
    cy.get('#description').type('Automation-Test')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the source
    // choose non-tidal and continue
    cy.get('input#source-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the loss category
    // choose low and continue
    cy.get('input#loss-3').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Enter the total quantity to use for this charge reference
    // enter 150 and continue
    cy.get('#volume').type('150')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the water availability
    // choose Restricted availability or no availability and continue
    cy.get('input#isRestrictedSource-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the water modelling charge
    // choose Tier 1 and continue
    cy.get('input#waterModel-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do additional charges apply?
    // choose No and continue
    cy.get('#isAdditionalCharges-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do adjustments apply?
    // choose Yes and continue
    cy.get('input#isAdjustments').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Which adjustments apply?
    // choose Charge adjustment, enter a Factor and continue
    cy.get('#adjustments-4').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // confirm
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

    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run.')
  })
})
