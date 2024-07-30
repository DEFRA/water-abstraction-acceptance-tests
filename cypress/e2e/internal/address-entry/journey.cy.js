'use strict'

describe('Address lookup journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('allows addresses to be entered manually or via the lookup', () => {
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

    // Navigate to the paper returns flow. We'll use it's address entry screens to test the address lookup and entry
    // functionality
    cy.get('#navbar-notifications').click()
    cy.get('a[href="/returns-notifications/forms"]').click()

    // Select a licence to generate paper returns for
    cy.get('#licenceNumbers').type('AT/CURR/MONTHLY/02')
    cy.get('button.govuk-button').click()

    // MANUAL ADDRESS ENTRY
    // Select the option to change the address then the option to setup a one-time address - manual address entry
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    cy.get('input[name="fullName"]').type('Manual Address')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
    cy.get('input[name="postcode"]').type('EX1 1QA')
    cy.get('button.govuk-button').click()

    // Opt to enter the address manually
    cy.get('a.govuk-link').eq(4).should('contain', 'I cannot find the address in the list').click()

    // Enter the address
    cy.get('input[name="addressLine1"]').type('Sub-building')
    cy.get('input[name="addressLine2"]').type('Building number')
    cy.get('input[name="addressLine3"]').type('Building Name')
    cy.get('input[name="addressLine4"]').type('Street Name')
    cy.get('input[name="town"]').type('Test Town')
    cy.get('input[name="county"]').type('RainingAllTheTimeShire')
    cy.get('select[name="country"]').select('United Kingdom')
    cy.get('button.govuk-button').click()

    // ADDRESS LOOKUP
    // Select the option to change the address then the option to setup a one-time address - address lookup
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    cy.get('input[name="fullName"]').type('Lookup Address')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
    cy.get('input[name="postcode"]').type('BS1 5AH')
    cy.get('button.govuk-button').click()

    // Select the address
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen too quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    cy.get('.govuk-select').select('340116')
    cy.get('button.govuk-button').click()

    // OUTSIDE UK
    // Select the option to change the address then the option to setup a one-time address - outside UK
    cy.get('[href*="/select-address"]').click()
    cy.get('#selectedRole-3').check()
    cy.get('button.govuk-button').click()

    // Who should receive the form?
    cy.get('input[name="fullName"]').type('Outside United')
    cy.get('button.govuk-button').click()

    // Enter the UK postcode
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
  })
})
