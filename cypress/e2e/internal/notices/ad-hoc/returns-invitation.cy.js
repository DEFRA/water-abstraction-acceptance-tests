'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-previous-return-log.js'

describe('Ad-hoc returns invitation journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body)

        cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('invites a customer to submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the Notices page
    cy.visit('/system/notices')

    // Start the standard notice journey
    cy.get('.govuk-button').contains('Create an ad-hoc notice').click()

    // Enter a licence number
    cy.get('#licenceRef').type('AT/TE/ST/01/01')
    cy.contains('Continue').click()

    // Select the notice type
    cy.get('#noticeType').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="licence-number"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="returns-notice-type"]').should('contain.text', 'Returns invitation')
    cy.contains('Confirm').click()

    // Capture the notice reference so we can verify it later
    cy.contains('.govuk-caption-l', 'Notice').invoke('text').then((text) => {
      cy.wrap(text.trim()).as('noticeReference')
    })

    // Recipients count
    cy.contains('Showing all 1 recipients')

    // Add an additional recipient
    cy.contains('Manage recipients').click()
    cy.contains('Set up a single use address or email address').click()

    // Select 'post' and add the contacts name
    cy.get('#contactType-2').check()
    cy.get('#contactName').type('Lookup recipient')
    cy.contains('Continue').click()

    // Enter the postcode
    cy.get('#postcode').type('BS1 5AH')
    cy.contains('Find addresses').click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen to quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    cy.get('#addresses').select('340116')
    cy.contains('Continue').click()

    // Recipients count
    cy.contains('Showing all 2 recipients')

    // Additional recipient is shown in the list
    cy.get('[data-test^="recipient-contact"]').should('have.length', 2)
    cy.get('[data-test="recipient-contact-0"]').within(() => {
      cy.contains('Lookup recipient')
      cy.contains('ENVIRONMENT AGENCY')
      cy.contains('HORIZON HOUSE DEANERY ROAD')
      cy.contains('BRISTOL')
      cy.contains('BS1 5AH')
    })
    cy.get('[data-test="recipient-licence-numbers-0"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="recipient-method-0"]').should('contain.text', 'Letter - single use')
    cy.get('[data-test="recipient-action-0"]').within(() => {
      cy.contains('Preview')
    })

    cy.get('[data-test="recipient-contact-1"]').should('contain.text', 'external@example.com')
    cy.get('[data-test="recipient-licence-numbers-1"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="recipient-method-1"]').should('contain.text', 'Email - primary user')
    cy.get('[data-test="recipient-action-1"]').within(() => {
      cy.contains('Preview')
    })

    cy.get('[data-test="recipient-action-0"]').contains('Preview').click()

    // Preview contains the contact name and address
    cy.contains('Returns invitation ad-hoc')
    cy.contains('Lookup recipient')
    cy.get('.govuk-back-link').click()

    // Check the recipients
    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Returns invitations sent')
    cy.get('.govuk-link').contains('View notice').click()

    // Notice page contains the recipients
    cy.get('@noticeReference').then((noticeReference) => {
      cy.contains('.govuk-caption-l', noticeReference)
    })

    cy.contains('Showing all 2 notifications')

    cy.get('[data-test^="notification-recipient"]').should('have.length', 2)
    cy.get('[data-test="notification-recipient0"]').within(() => {
      cy.contains('external@example.com')
    })

    cy.get('[data-test="notification-recipient1"]').within(() => {
      cy.contains('Lookup recipient')
      cy.contains('ENVIRONMENT AGENCY')
      cy.contains('HORIZON HOUSE DEANERY ROAD')
      cy.contains('BRISTOL')
      cy.contains('BS1 5AH')
    })
  })
})
