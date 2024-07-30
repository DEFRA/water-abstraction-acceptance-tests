'use strict'

describe('PRESROC licence transfer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('adds a new charge information which transfers the licence to a new billing account with new address and FAO contact then approves it and confirms licence is flagged for supplementary billing', () => {
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

    // Confirm we are on the licence page and select licence set up tab
    cy.contains('AT/CURR/DAILY/01')
    cy.contains('Licence set up').click()

    // Confirm we are on the tab page and then click Set up a new charge
    cy.contains('Licence set up')
    cy.contains('Set up a new charge').click()

    // Select reason for new charge information
    // choose Licence transferred and now chargeable and continue
    cy.get('input#reason-5').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set charge start date
    // choose Licence version start date and continue
    cy.get('input#startDate-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Who should the bills go to?
    // choose Another billing contact then enter a name to search for and continue
    cy.get('input#account-2').click()
    cy.get('input#accountSearch').type('Automation-Test-Comp')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the account type
    // choose Individual and then enter a name and continue
    cy.get('input#accountType-3').click()
    cy.get('input#personName').type('John Smith')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select an existing address for Big Farm Co Ltd
    // choose Set up a new address and continue
    cy.get('input#selectedAddress-3').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Enter the UK postcode
    // enter the postcode and click Find address
    cy.get('input#postcode').type('BS1 5AH')
    cy.get('form > .govuk-button').contains('Find address').click()

    // Select the address
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen too quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(2000)
    cy.get('.govuk-select').select('340116')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Do you need to add an FAO?
    // choose Yes and continue
    cy.get('input#faoRequired').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Set up a contact
    // choose Add a new person and continue
    cy.get('input#selectedContact').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Add a new contact
    // enter the contact's details (only the mandatory fields) and continue
    cy.get('input#firstName').type('Jim')
    cy.get('input#lastName').type('Bob')
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check billing account details
    // check the details are as expected and confirm
    cy.get('section > dl').within(() => {
      cy.get('div:nth-child(1) > dd.govuk-summary-list__value').should('contain.text', 'John Smith')
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', 'BS1 5AH')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Jim\n    Bob')
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
      cy.get('div:nth-child(2) > dd.govuk-summary-list__value').should('contain.text', '1 January 2020')
      // billing account
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'John Smith')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'Jim\n    Bob')
      cy.get('div:nth-child(3) > dd.govuk-summary-list__value').should('contain.text', 'BS1 5AH')
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

    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
