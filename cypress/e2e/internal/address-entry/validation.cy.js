'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Address lookup validation (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('allows addresses to be entered manually or via the lookup', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the paper returns flow. We'll use it's address entry screens to test the address lookup and entry
    // functionality
    cy.visit('/returns-notifications/forms')

    // Select a licence to generate paper returns for
    cy.get('#licenceNumbers').type('AT/CURR/DAILY/01')
    cy.get('button.govuk-button').click()

    // MANUAL ADDRESS ENTRY
    // Select the option to change the address then the option to setup a one-time address - manual address entry
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    // enter an empty string and continue
    cy.get('input[name="fullName"]').type(' ')
    cy.get('button.govuk-button').click()
    cy.get('.govuk-error-summary__title').should('contain', 'There is a problem')
    cy.get('.govuk-error-summary__body').should('contain', 'Enter a full name')
    cy.get('#fullName-error').should('contain', 'Enter a full name')

    cy.get('input[name="fullName"]').type('Manual Address')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
    // enter an empty string and continue
    cy.get('input[name="postcode"]').type(' ')
    cy.get('button.govuk-button').click()
    cy.get('.govuk-error-summary__title').should('contain', 'There is a problem')
    cy.get('.govuk-error-summary__body').should('contain', 'Enter a UK postcode')
    cy.get('#postcode-error').should('contain', 'Enter a UK postcode')

    cy.get('input[name="postcode"]').type('EX1 1QA')
    cy.get('button.govuk-button').click()

    // Select the address
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen to quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    // click continue without selecting an address
    cy.get('button.govuk-button').click()
    cy.get('.govuk-error-summary__title').should('contain', 'There is a problem')
    cy.get('.govuk-error-summary__body').should('contain', 'Select an address from the list')
    cy.get('#uprn-error').should('contain', 'Select an address from the list')

    cy.get('a.govuk-link').eq(4).should('contain', 'I cannot find the address in the list').click()

    // Enter the address
    // enter empty string and select invalid country
    cy.get('input[name="postcode"]').type(' ')
    cy.get('select[name="country"]').select('Select a country')
    cy.get('button.govuk-button').click()
    cy.get('.govuk-error-summary').should('be.visible')
    cy.get('.govuk-error-summary__title').should('contain', 'There is a problem')
    cy.get('a[href="#addressLine2"]').should('contain', 'Enter either a building number or building name')
    cy.get('a[href="#addressLine4"]').should('contain', 'Enter either a street name or town or city')
    cy.get('a[href="#country"]').should('contain', 'Select a country')

    cy.get('input[name="addressLine1"]').type('Sub-building')
    cy.get('input[name="addressLine2"]').type('Building number')
    cy.get('input[name="addressLine3"]').type('Building Name')
    cy.get('input[name="addressLine4"]').type('Street Name')
    cy.get('input[name="town"]').type('Test Town')
    cy.get('input[name="county"]').type('RainingAllTheTimeShire')
    cy.get('input[name="postcode"]').clear()
    cy.get('input[name="postcode"]').type('RA1 1AN')
    cy.get('select[name="country"]').select('United Kingdom')
    cy.get('button.govuk-button').click()

    // Check returns details
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Manual Address')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Sub-building')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Building number')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Test Town')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('RA1 1AN')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('United Kingdom')

    // ADDRESS LOOKUP
    // Select the option to change the address then the option to setup a one-time address - address lookup
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    cy.get('input[name="fullName"]').type('Address Lookup')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
    cy.get('input[name="postcode"]').type('BS1 5AH')
    cy.get('button.govuk-button').click()

    // Select the address
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen to quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    cy.get('.govuk-select').select('340116')
    cy.get('button.govuk-button').click()

    // Check returns details
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Address Lookup')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('ENVIRONMENT AGENCY')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('HORIZON HOUSE')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('DEANERY ROAD')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('BRISTOL')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('BS1 5AH')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('United Kingdom')

    // OUTSIDE UK
    // Select the option to change the address then the option to setup a one-time address - outside UK
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    cy.get('input[name="fullName"]').type('Outside United')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
    // click the 'This address is outside the UK' link
    cy.get("a[href*='manual-entry']").click()

    // Enter the address
    cy.get('input[name="addressLine1"]').type('Sub-building')
    cy.get('input[name="addressLine2"]').type('Building number')
    cy.get('input[name="addressLine3"]').type('Building Name')
    cy.get('input[name="addressLine4"]').type('Street Name')
    cy.get('input[name="town"]').type('Test Town')
    cy.get('input[name="county"]').type('RainingAllTheTimeShire')
    cy.get('input[name="postcode"]').type('RA1 N')
    cy.get('select[name="country"]').select('Croatia')
    cy.get('button.govuk-button').click()

    // Check returns details
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Outside United')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Sub-building')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Building number')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Building Name')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Street Name')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Test Town')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('RainingAllTheTimeShire')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('RA1 N')
    cy.get('div.govuk-summary-list__row').eq(2).children(1).contains('Croatia')
  })
})
