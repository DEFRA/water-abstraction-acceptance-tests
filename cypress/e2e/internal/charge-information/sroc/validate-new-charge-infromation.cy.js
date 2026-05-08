'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-presroc-chg-ver.js'

const scenario = scenarioData()

describe('SROC charge information validation (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('adds a new charge information with a new billing account and a note, and sets up the charge reference including additional charges and adjustments', () => {
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
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select a reason for new charge information')
    cy.get('.govuk-error-message').should('contain.text', 'Select a reason for new charge information')
    // choose Change to charge scheme and continue
    cy.get('input#reason-3').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set charge start date
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select charge information start date')
    cy.get('.govuk-error-message').should('contain.text', 'Select charge information start date')
    // choose another date
    cy.get('input#startDate-4').click()
    // test date before licence start date
    cy.get('#customDate-day').type('1')
    cy.get('#customDate-month').type('6')
    cy.get('#customDate-year').type('2017')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Date must be after the start date of the earliest known licence version')
    cy.get('.govuk-error-message').should('contain.text', 'Date must be after the start date of the earliest known licence version')
    // test not a real date
    cy.get('#customDate-day').clear().type('aa')
    cy.get('#customDate-month').clear().type('6')
    cy.get('#customDate-year').clear().type('2022')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Enter a real date for the charge information start date')
    cy.get('.govuk-error-message').should('contain.text', 'Enter a real date for the charge information start date')
    // enter 2022-06-01 and continue
    cy.get('#customDate-day').clear().type('1')
    cy.get('#customDate-month').clear().type('6')
    cy.get('#customDate-year').clear().type('2022')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Who should the bills go to?
    // the existing account is automatically selected so just continue
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select an existing address for Big Farm Co Ltd
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select an existing address, or set up a new one.')
    cy.get('.govuk-error-message').should('contain.text', 'Select an existing address, or set up a new one.')
    // choose the existing address and continue
    cy.get('input#selectedAddress').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do you need to add an FAO?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select yes if you need to add a person or department as an FAO')
    cy.get('.govuk-error-message').should('contain.text', 'Select yes if you need to add a person or department as an FAO')
    // choose No and continue
    cy.get('input#faoRequired-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check billing account details
    // check the details are as expected and confirm
    cy.get('section > dl').within(() => {
      cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm Co Ltd')
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'TT1 1TT')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'No')
    })
    cy.get('form > .govuk-button').contains('Confirm').click()

    // Use abstraction data to set up the element?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select whether to use abstraction data to set up the element')
    cy.get('.govuk-error-message').should('contain.text', 'Select whether to use abstraction data to set up the element')
    // choose Use charge information valid from 1 June 2022 and continue
    cy.get('input#useAbstractionData-4').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // check the charge details and element details are as expected and then select option to add a note
    cy.get('section:nth-child(1) > dl').within(() => {
      // reason
      cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Change to charge scheme')
      // start date
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', '1 June 2022')
      // billing account
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm')
      // licence holder
      cy.get('div:nth-child(4) > dd.govuk-summary-list__value').should('contain.text', 'Big Farm Co Ltd')
    })
    cy.get('form > section > h2').should('contain.text', 'Element')
    cy.get('form > section > dl').within(() => {
      // description
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'Test Charge Element!')
      // abstraction period
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', '1 April to 31 March')
      // annual quantities
      cy.get('div:nth-child(4) > dd.govuk-summary-list__value').should('contain.text', '15.54ML authorised')
      // time limit
      cy.get('div:nth-child(5) > dd.govuk-summary-list__value').should('contain.text', 'No')
      // loss
      cy.get('div:nth-child(6) > dd.govuk-summary-list__value').should('contain.text', 'Medium')
    })
    cy.get('section:nth-child(2) > p > a').click()

    // Add a note
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Enter details.')
    cy.get('.govuk-error-message').should('contain.text', 'Enter details.')
    // enter a note and continue
    cy.get('#note').type('This is Automation Testing')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // back on this page we confirm the note we added is present then set the charge reference
    cy.get('#main-content > :nth-child(1) > :nth-child(2) > :nth-child(2)').within(() => {
      cy.get('dt').should('contain.text', 'billing.data@wrls.gov.uk')
      cy.get('dd.govuk-summary-list__value').should('contain.text', 'This is Automation Testing')
    })
    cy.get('button:nth-child(3)').click()

    // Enter a description for the charge reference
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Enter a description for the charge reference')
    cy.get('.govuk-error-message').should('contain.text', 'Enter a description for the charge reference')
    // test submitting invalid characters. We loop through testing each one
    cy.wrap(['“', '”', '?', '^', '£', '≥', '≤', '—']).each((character) => {
      cy.get('#description').clear().type(character)
      cy.get('form > .govuk-button').contains('Continue').click()
      cy.get('.govuk-error-summary__list').should('contain.text', 'You can not use “ ” ? ^ £ ≥ ≤ — (long dash) in the charge reference description')
      cy.get('.govuk-error-message').should('contain.text', 'You can not use “ ” ? ^ £ ≥ ≤ — (long dash) in the charge reference description')
    })
    // enter a description made up of valid special characters and continue
    cy.get('#description').clear().type('-\'.,()&* are supported characters')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the source
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select if the source is tidal or non-tidal.')
    cy.get('.govuk-error-message').should('contain.text', 'Select if the source is tidal or non-tidal.')
    // select non-tidal and continue
    cy.get('input#source-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the loss category
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select if the loss category is high, medium or low.')
    cy.get('.govuk-error-message').should('contain.text', 'Select if the loss category is high, medium or low.')
    // select low and continue
    cy.get('input#loss-3').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Enter the total quantity to use for this charge reference
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Enter the volume in ML (megalitres).')
    cy.get('.govuk-error-message').should('contain.text', 'Enter the volume in ML (megalitres).')
    // test submitting not a real number
    cy.get('#volume').type('1a')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Enter the volume in ML (megalitres).')
    cy.get('.govuk-error-message').should('contain.text', 'Enter the volume in ML (megalitres).')
    // test submitting -1
    cy.get('#volume').clear().type('-1')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'The volume must be greater than 0')
    cy.get('.govuk-error-message').should('contain.text', 'The volume must be greater than 0')
    // test submitting 0
    cy.get('#volume').clear().type('0')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'The volume must be greater than 0')
    cy.get('.govuk-error-message').should('contain.text', 'The volume must be greater than 0')
    // enter 0.5 to confirm decimal numbers are allowed and continue
    cy.get('#volume').clear().type('0.5')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the water availability
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select the water availability.')
    cy.get('.govuk-error-message').should('contain.text', 'Select the water availability.')
    // choose Restricted availability or no availability and continue
    cy.get('input#isRestrictedSource-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the water modelling charge
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select the water modelling charge.')
    cy.get('.govuk-error-message').should('contain.text', 'Select the water modelling charge.')
    // choose Tier 1 and continue
    cy.get('input#waterModel-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do additional charges apply?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', "Select 'yes' if additional charges apply.")
    cy.get('.govuk-error-message').should('contain.text', "Select 'yes' if additional charges apply.")
    // choose Yes and continue
    cy.get('input#isAdditionalCharges').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Is abstraction from a supported source?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', "Select 'yes' if abstraction is from a supported source.")
    cy.get('.govuk-error-message').should('contain.text', "Select 'yes' if abstraction is from a supported source.")
    // choose Yes and continue
    cy.get('input#isSupportedSource').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the name of the supported source
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'Select the name of the supported source.')
    cy.get('.govuk-error-message').should('contain.text', 'Select the name of the supported source.')
    // choose Rhee Groundwater and continue
    cy.get('input#supportedSourceId-12').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Is abstraction for the supply of public water?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', "Select 'yes' if abstraction is for the supply of public water.")
    cy.get('.govuk-error-message').should('contain.text', "Select 'yes' if abstraction is for the supply of public water.")
    // choose Yes and continue
    cy.get('input#isSupplyPublicWater').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do adjustments apply?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', "Select 'yes' if adjustments apply.")
    cy.get('.govuk-error-message').should('contain.text', "Select 'yes' if adjustments apply.")
    // choose Yes and continue
    cy.get('input#isAdjustments').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Which adjustments apply?
    // test submitting nothing
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', 'At least one condition must be selected')
    cy.get('.govuk-error-message').should('contain.text', 'At least one condition must be selected')
    // choose Charge Adjustment
    cy.get('input#adjustments-2').check()
    // test not submitting a factor
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary__list').should('contain.text', "The 'Charge adjustment' factor must not have more than 15 decimal places.")
    cy.get('.govuk-error-message').should('contain.text', "The 'Charge adjustment' factor must not have more than 15 decimal places.")
    // choose Charge adjustment, enter a Factor and continue
    cy.get('#chargeFactor').type('25')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check charge information
    // back on the check charge information screen there is now new sections covering the charge reference. We confirm
    // they exist and the details match what we entered and then confirm
    cy.get(':nth-child(1) > .govuk-grid-column-full > form').within(() => {
      cy.get('h2.govuk-heading-l > span').should('contain.text', 'Charge reference 4.4.5')
      cy.get('h2:nth-child(4)').should('contain.text', 'Charge reference details')

      cy.get('dl:nth-child(5)').within(() => {
        // applies to
        cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Test Charge Element!')
        // description
        cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'are supported characters')
        // source
        cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Non-tidal')
        // loss
        cy.get('div:nth-child(4) > dd.govuk-summary-list__value').should('contain.text', 'Low')
        // volume
        cy.get('div:nth-child(5) > dd.govuk-summary-list__value').should('contain.text', '0.5ML')
        // water availability
        cy.get('div:nth-child(6) > dd.govuk-summary-list__value').should('contain.text', 'Restricted availablity')
        // water model
        cy.get('div:nth-child(7) > dd.govuk-summary-list__value').should('contain.text', 'Tier 1')
        // additional charges apply
        cy.get('div:nth-child(8) > dd.govuk-summary-list__value').should('contain.text', 'Yes')
        // adjustments apply
        cy.get('div:nth-child(9) > dd.govuk-summary-list__value').should('contain.text', 'Yes')
        // eic region
        cy.get('div:nth-child(10) > dd.govuk-summary-list__value').should('contain.text', 'Southern')
      })

      cy.get('h2:nth-child(7)').should('contain.text', 'Additional charges')
      cy.get('dl:nth-child(8)').within(() => {
        // supported source
        cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'Yes')
        // supported source name
        cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'Rhee Groundwater')
        // supply public water
        cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Yes')
      })

      cy.get('dl:nth-child(10)').within(() => {
        cy.get('div:nth-child(1) > dt').should('contain.text', 'Adjustments')

        // adjustment factor
        cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', '25')
      })
    })
    cy.get('form > .govuk-button').contains('Confirm').click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    cy.get('.govuk-panel__title').should('contain', 'Charge information complete')
    cy.get('a[href*="licences/"]').contains('View charge information').click()

    // Charge information
    // confirm our new charge information is in REVIEW
    cy.contains('Review')
  })
})
