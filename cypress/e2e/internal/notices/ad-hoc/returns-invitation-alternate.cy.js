'use strict'

import scenarioData from '../../../../support/scenarios/licence-with-open-return-log-bad-primary-user.js'
import { formatLongDate, relativeToToday } from '../../../../support/helpers/date.helpers.js'

describe('Ad-hoc returns invitation alternate journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body)

      cy.load(scenario)
    })

    const expectedDueDate = formatLongDate(relativeToToday(29))

    cy.wrap(expectedDueDate).as('expectedDueDate')

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('sends a return invite to a "bad" primary user, triggering the alternate notification to the licence, which when confirmed will set the "due date" on the OPEN return log', () => {
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

    // Check the recipients
    cy.contains('Showing all 1 recipients')

    // Bad primary user is shown in the list
    cy.get('[data-test^="recipient-contact"]').should('have.length', 1)

    cy.get('[data-test="recipient-contact-0"]').should('contain.text', 'iwill-fail@e')
    cy.get('[data-test="recipient-licence-numbers-0"]').should('contain.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="recipient-method-0"]').should('contain.text', 'Email - primary user')
    cy.get('[data-test="recipient-action-0"]').within(() => {
      cy.contains('Preview')
    })

    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Returns invitations sent')
    cy.get('.govuk-link').contains('View notice').click()

    // Notice page contains the recipients
    cy.get('@noticeReference').then((noticeReference) => {
      cy.contains('.govuk-caption-l', noticeReference)
    })

    cy.contains('Showing all 1 notifications')

    cy.get('[data-test^="notification-recipient"]').should('have.length', 1)
    cy.get('[data-test="notification-recipient0"]').within(() => {
      cy.contains('iwill-fail@e')
    })

    // Wait for notification to be flagged as errored. We know the service will pause for 5 seconds between between
    // sending and then checking the email's status
    cy.reloadUntilTextFound('#main-content > :nth-child(3) > .govuk-tag', 'error')

    // Go back to the Notices page and wait for the alternate notice to appear as pending
    cy.get('.govuk-back-link').click()
    cy.reloadUntilTextFound('[data-test="notice-status-0"] > .govuk-tag', 'pending')

    // Confirm it _is_ the alternate and not the notice we created!
    cy.get('@noticeReference').then((noticeReference) => {
      cy.get('[data-test="notice-reference-0"]').should('not.contain.text', noticeReference)
    })

    cy.get('[data-test="notice-date-created-0"] > .govuk-link').click()

    cy.get('[data-test="notification-recipient0"]').within(() => {
      cy.contains('Big Farm Co Ltd')
      cy.contains('HORIZON HOUSE')
      cy.contains('DEANERY ROAD')
      cy.contains('BRISTOL')
      cy.contains('BS1 5AH')
    })

    // Trigger the notification status job and then wait for Notify to confirm the letter was successful
    cy.triggerJob('notification-status')
    cy.reloadUntilTextFound('#main-content > :nth-child(3) > .govuk-tag', 'sent')

    // Search for the licence so we can check the 'OPEN' return now has a due date assigned
    cy.get('#nav-search').click()
    cy.get('[name="query"]').type('AT/TE/ST/01/01')
    cy.get('#search-button').click()
    cy.get('.searchresult-link').contains('AT/TE/ST/01/01').click()
    cy.get(':nth-child(4) > .x-govuk-sub-navigation__link').click()
    cy.get('[data-test="return-reference-0"] > .govuk-link').should('contain.text', '9999990')

    cy.get('@expectedDueDate').then((expectedDueDate) => {
      cy.get('[data-test="return-due-date-0"]').should('contain.text', expectedDueDate)
    })
  })
})
