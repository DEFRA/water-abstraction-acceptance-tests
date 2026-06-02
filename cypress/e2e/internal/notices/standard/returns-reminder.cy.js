'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-due-return-log-for-first-period.js'

describe('Standard returns reminder journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body)

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('reminds a customer to submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the Notices page
    cy.visit('/system/notices')

    // Start the standard notice journey
    cy.get('.govuk-button').contains('Create a standard notice').click()

    // Select the notice type
    cy.get('#noticeType-2').check()
    cy.contains('Continue').click()

    // Select the returns periods for the invitations
    cy.get('#returnsPeriod').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="notice-type"]').should('contain.text', 'Returns reminder')
    cy.contains('Confirm').click()

    // Capture the notice reference so we can verify it later
    cy.contains('.govuk-caption-l', 'Notice').invoke('text').then((text) => {
      cy.wrap(text.trim()).as('noticeReference')
    })

    // Check the recipients
    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Returns reminders sent')
    cy.get('.govuk-link').contains('View notice').click()

    // Notice page contains our seeded recipient
    cy.get('@noticeReference').then((noticeReference) => {
      cy.contains('.govuk-caption-l', noticeReference)
    })

    cy.get('#main-content > details > summary > span').click()
    cy.get('[data-test="filter-licence"]').type('AT/TE/ST/01/01')
    cy.contains('Apply filters').click()
    cy.get('[data-test="notification-licences-0"]').should('contain.text', 'AT/TE/ST/01/01')
  })
})
