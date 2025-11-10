'use strict'

import scenarioData from '../../../../support/scenarios/return-notices.js'

describe('Ad-hoc returns invitation journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body.firstReturnPeriod)

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
    cy.get('#licenceRef').type('AT/TEST/01')
    cy.get('button.govuk-button').click()

    // Select the notice type
    cy.get('#noticeType').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="licence-number"]').should('contain.text', 'AT/TEST/01')
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
    cy.get('#contactName').type('Pomona Sprout')
    cy.get('button.govuk-button').click()

    // Enter the postcode
    cy.get('#postcode').type('BS1 5AH')
    cy.get('button.govuk-button').click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    cy.wait(1000)
    cy.get('#addresses').select('340116')
    cy.get('button.govuk-button').click()

    // Recipients count
    cy.contains('Showing all 2 recipients')

    // Additional recipient is shown in the list
    cy.contains('Pomona Sprout')
    cy.contains('Letter - Single use')
    cy.contains('tr', 'Letter - Single use')
      .within(() => {
        cy.contains('a', 'Preview').click()
      })

    // Preview contains the contact name and address
    cy.contains('Returns invitation licence holder letter')
    cy.contains('Pomona Sprout')
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
      cy.contains('Pomona Sprout')
      cy.contains('ENVIRONMENT AGENCY')
      cy.contains('HORIZON HOUSE')
      cy.contains('BS1 5AH')
    })
  })
})
