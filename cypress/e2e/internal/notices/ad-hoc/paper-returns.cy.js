'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-previous-return-log.js'

describe('Ad-hoc Paper returns journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body)

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('generates a paper return sent by Notify to the licensee', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the Notices page
    cy.visit('/system/notices')

    // Start the ad-hoc notice journey
    cy.get('.govuk-button').contains('Create an ad-hoc notice').click()

    // Enter a licence number
    cy.get('#licenceRef').type('AT/TE/ST/01/01')
    cy.get('button.govuk-button').click()

    // Select the notice type
    cy.get('#noticeType-3').check()
    cy.contains('Continue').click()

    // Select the returns for the paper return
    cy.get('#returns').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="licence-number"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="returns-notice-type"]').should('contain.text', 'Paper return')
    cy.contains('Confirm').click()

    // Capture the notice reference so we can verify it later
    cy.contains('.govuk-caption-l', 'Notice').invoke('text').then((text) => {
      cy.wrap(text.trim()).as('noticeReference')
    })

    // Recipients count
    cy.contains('Showing all 1 recipients')

    // Add an additional recipient
    cy.contains('Manage recipients').click()
    cy.contains('Set up a single use address').click()

    // Enter the recipient's name
    cy.get('#name').type('Manual Recipient')
    cy.contains('Continue').click()

    // Enter a UK postcode
    cy.get('#postcode').type('BS1 5AH')
    cy.contains('Find addresses').click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen to quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    cy.contains('I cannot find the address in the list').click()

    // Enter the address
    cy.get('#addressLine1').type('4 Privet drive')
    cy.get('#addressLine2').type('Little Whinging')
    cy.get('#addressLine3').type('Surrey')
    cy.get('#postcode').clear().type('WD25 7LR')
    cy.contains('Continue').click()

    // Recipients count
    cy.contains('Showing all 2 recipients')

    // Additional recipient is shown in the list
    cy.get('[data-test^="recipient-contact"]').should('have.length', 2)
    cy.get('[data-test="recipient-contact-1"]').within(() => {
      cy.contains('Manual Recipient')
      cy.contains('4 Privet drive')
      cy.contains('Little Whinging')
      cy.contains('Surrey')
      cy.contains('WD25 7LR')
    })
    cy.get('[data-test="recipient-licence-numbers-1"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="recipient-method-1"]').should('contain.text', 'Letter - single use')
    cy.get('[data-test="recipient-action-1"]').within(() => {
      cy.contains('Preview')
    })

    // Check the recipients
    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Paper returns sent')
    cy.get('.govuk-link').contains('View notice').click()

    // Notice page contains the recipients
    cy.get('@noticeReference').then((noticeReference) => {
      cy.contains('.govuk-caption-l', noticeReference)
    })

    cy.contains('Showing all 2 notifications')

    cy.get('[data-test^="notification-recipient"]').should('have.length', 2)
    cy.get('[data-test="notification-recipient1"]').within(() => {
      cy.contains('Manual Recipient')
      cy.contains('4 Privet drive')
      cy.contains('Little Whinging')
      cy.contains('Surrey')
      cy.contains('WD25 7LR')
    })
  })
})
