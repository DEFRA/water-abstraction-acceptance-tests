'use strict'

import scenarioData from '../../../../support/scenarios/return-notices.js'

describe('Ad-hoc returns invitation journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      const period = body.firstReturnPeriod

      cy.previousPeriod(period).then((previousPeriod) => {
        const scenario = scenarioData(previousPeriod)

        cy.load(scenario)
      })
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
    cy.fixture('notice-recipients.json').as('noticeRecipients')
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
    cy.get('@noticeRecipients').then(({ licenceNumber }) => {
      cy.get('#licenceRef').type(licenceNumber)
    })
    cy.get('button.govuk-button').click()

    // Select the notice type
    cy.get('#noticeType').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('@noticeRecipients').then(({ licenceNumber }) => {
      cy.get('[data-test="licence-number"]').should('contain.text', licenceNumber)
    })
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
    cy.get('@noticeRecipients').then(({ singleUseLetter }) => {
      cy.get('#contactName').type(singleUseLetter.contactName)
    })
    cy.get('button.govuk-button').click()

    // Enter the postcode
    cy.get('@noticeRecipients').then(({ singleUseLetter }) => {
      cy.get('#postcode').type(singleUseLetter.address.postcode)
    })
    cy.get('button.govuk-button').click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen to quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    cy.wait(1000)
    cy.get('#addresses').select('340116')
    cy.get('button.govuk-button').click()

    // Recipients count
    cy.contains('Showing all 2 recipients')

    // Additional recipient is shown in the list
    cy.get('@noticeRecipients').then(({ licenceNumber, singleUseLetter, primaryUserEmail }) => {
      cy.get('[data-test^="recipient-contact"]').should('have.length', 2)
      cy.get('[data-test="recipient-contact-0"]').within(() => {
        cy.contains(singleUseLetter.contactName)
        cy.contains(singleUseLetter.address.line1)
        cy.contains(singleUseLetter.address.line2)
        cy.contains(singleUseLetter.address.line3)
        cy.contains(singleUseLetter.address.postcode)
      })
      cy.get('[data-test="recipient-licence-numbers-0"]').should('contain.text', licenceNumber)
      cy.get('[data-test="recipient-method-0"]').should('contain.text', singleUseLetter.method)
      cy.get('[data-test="recipient-action-0"]').within(() => {
        cy.contains('Preview')
      })

      cy.get('[data-test="recipient-contact-1"]').should('contain.text', primaryUserEmail.email)
      cy.get('[data-test="recipient-licence-numbers-1"]').should('contain.text', licenceNumber)
      cy.get('[data-test="recipient-method-1"]').should('contain.text', primaryUserEmail.method)
      cy.get('[data-test="recipient-action-1"]').within(() => {
        cy.contains('Preview')
      })
    })

    cy.get('[data-test="recipient-action-0"]').contains('Preview').click()

    // Preview contains the contact name and address
    cy.contains('Returns invitation ad-hoc')
    cy.get('@noticeRecipients').then(({ singleUseLetter }) => {
      cy.contains(singleUseLetter.contactName)
    })
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
    cy.get('@noticeRecipients').then(({ singleUseLetter, primaryUserEmail }) => {
      cy.get('[data-test="notification-recipient0"]').within(() => {
        cy.contains(primaryUserEmail.email)
      })

      cy.get('[data-test="notification-recipient1"]').within(() => {
        cy.contains(singleUseLetter.contactName)
        cy.contains(singleUseLetter.address.line1)
        cy.contains(singleUseLetter.address.line2)
        cy.contains(singleUseLetter.address.line3)
        cy.contains(singleUseLetter.address.postcode)
      })
    })
  })
})
