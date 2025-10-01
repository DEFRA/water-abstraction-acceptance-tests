'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission-with-requirement.js'

const scenario = scenarioData()

describe('Paper returns journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('generates a paper form sent by Notify to the licensee', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the paper returns flow. We'll use it's address entry screens to test the address lookup and entry
    // functionality
    cy.visit('/system/manage')
    cy.get('a[href="/returns-notifications/forms"]').click()

    // Select a licence to generate paper returns for
    cy.get('#licenceNumbers').type('AT/CURR/DAILY/01')
    cy.get('button.govuk-button').click()

    // Select a return
    cy.get('a[href*="select-returns"]').click()
    cy.get('#returnIds').check()
    cy.get('button.govuk-button').click()

    // Send the paper form
    cy.get('button.govuk-button').contains('Send paper forms').click()

    // Paper return forms sent
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Paper return forms sent')
  })
})
