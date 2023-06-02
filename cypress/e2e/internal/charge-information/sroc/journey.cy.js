'use strict'

describe('SROC charge information journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('adds a new charge information with a new billing account, note and charge element note then sets up the charge reference including additional charges and adjustments and then approves it', () => {
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

    // Confirm we are on the licence page and select charge information tab
    cy.contains('AT/CURR/DAILY/01')
    cy.get('#tab_charge').click()

    // Confirm we are on the tab page and then click Set up a new charge
    cy.get('#charge > .govuk-heading-l').contains('Charge information')
    cy.get('#charge').contains('Set up a new charge').click()

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
    // add a note
    cy.get('section:nth-child(2) > p > a').click()

    // Add a note
    // enter a note and continue
    cy.get('#note').type('This is Automation Testing')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // add another element
    cy.get('button[value="addElement"]').contains('Add another element').click()

    // Select a purpose use
    // choose the one option available Animal Watering & General Use In Non Farming Situations and continue
    cy.get('input#purpose').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Add element description
    // enter a description and continue
    cy.get('input#description').type('test element description')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set abstraction period
    // enter start and end date and continue
    cy.get('input#startDate-day').type('1')
    cy.get('input#startDate-month').type('4')
    cy.get('input#endDate-day').type('30')
    cy.get('input#endDate-month').type('9')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Add annual quantities
    // enter annual quantity and continue
    cy.get('input#authorisedAnnualQuantity').type('10')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set time limit?
    // choose no and continue
    cy.get('input#timeLimitedPeriod-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select loss category
    // choose medium and continue
    cy.get('input#loss-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // set the charge reference
    cy.get('button[value="addChargeCategory"]').click()

    // Select the elements this charge reference is for
    // tick both and continue
    cy.get('input#selectedElementIds').check()
    cy.get('input#selectedElementIds-2').check()
    cy.get('form > .govuk-button').contains('Continue').click()

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
    // choose Yes and continue
    cy.get('input#isAdditionalCharges').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Is abstraction from a supported source?
    // choose Yes and continue
    cy.get('input#isSupportedSource').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the name of the supported source
    // choose Rhee Groundwater and continue
    cy.get('input#supportedSourceId-12').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Is abstraction for the supply of public water?
    // choose Yes and continue
    cy.get('input#isSupplyPublicWater').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do adjustments apply?
    // choose Yes and continue
    cy.get('input#isAdjustments').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Which adjustments apply?
    // choose Charge adjustment, enter a Factor and continue
    cy.get('input#adjustments-2').check()
    cy.get('#chargeFactor').type('25')
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
    cy.get('#charge > table > tbody > tr:nth-child(1) > td:nth-child(5) > a').contains('Review').click()

    // Check charge information
    // approve the new charge version
    cy.get('strong.govuk-tag--orange').should('contain.text', 'Review')
    cy.get('input#reviewOutcome').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Charge information
    // confirm our new charge information is APPROVED
    cy.get('#charge > table > tbody > tr:nth-child(1)').within(() => {
      cy.get('td:nth-child(4) > strong').should('contain.text', 'Approved')
    })
  })
})
