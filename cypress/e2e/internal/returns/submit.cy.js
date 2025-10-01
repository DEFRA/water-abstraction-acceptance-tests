'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return for a licence from its returns tab and mark the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // confirm we are on the licence page and select returns tab
    cy.contains('AT/CURR/DAILY/01')
    cy.get('[data-test="#tab_returns"]').click()

    // confirm we are on the tab page
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    // Select the return log to submit
    cy.get('[data-test="return-reference-0"] > .govuk-link').click()

    // Abstraction return
    // submit return
    cy.get('form > .govuk-button').first().click()

    // When was the return received?
    // select today
    cy.get('label.govuk-radios__label').contains('Today').click()
    cy.get('form > .govuk-button').click()

    // What do you want to do with this return?
    // choose Enter and submit and continue
    cy.get('label.govuk-radios__label').contains('Enter and submit').click()
    cy.get('form > .govuk-button').click()

    // How was this return reported?
    // choose Abstraction volumes and continue
    cy.get('label.govuk-radios__label').contains('Abstraction Volumes').click()
    cy.get('form > .govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('input#units').check()
    cy.get('form > .govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('label.govuk-radios__label').contains('No').click()
    cy.get('form > .govuk-button').click()

    // Is it a single volume?
    // choose Yes, enter 100 cubic metres and continue
    cy.get('label.govuk-radios__label').contains('Yes').click()
    cy.get('input#single-volume-quantity').type('100')
    cy.get('form > .govuk-button').click()

    // What period was used for this volume?
    // choose Default abstraction period and continue
    cy.get('label.govuk-radios__label').contains('Default abstraction period').click()
    cy.get('form > .govuk-button').click()

    // Volumes
    // we leave the defaulted values of 50CM, which are 100CM split by the number of months in the abstraction
    // period (2) and continue
    cy.get('div > .govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click the Mark for supplementary bill run button
    cy.get('.govuk-panel').should('contain.text', 'Return 9999990 submitted')
    cy.get('.govuk-button').contains('Mark for supplementary bill run').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content').should(
      'contain.text',
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
