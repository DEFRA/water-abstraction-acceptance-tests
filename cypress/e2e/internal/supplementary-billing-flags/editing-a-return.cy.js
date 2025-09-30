'use strict'

import editingReturn from '../../../support/scenarios/editing-return.js'

const editingReturnScenario = editingReturn()

describe('Editing a return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(editingReturnScenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return for a licence from its returns tab and mark the licence for two-part tariff supplementary billing', () => {
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

    // confirm we see the return we are going to edit
    cy.get('#returns').within(() => {
      cy.get('[data-test="return-reference-0"] > .govuk-link').should('be.visible').and('contain.text', '9999990')
      cy.get('[data-test="return-status-0"] > .govuk-tag').should('be.visible').and('contain.text', 'complete')

      cy.get('[data-test="return-reference-0"] > .govuk-link').contains('9999990').click()
    })

    // Edit return
    cy.get('.govuk-button').first().click()

    // When was the return received?
    // choose Today and continue
    cy.get('input#received-date-options').check()
    cy.get('form > .govuk-button').click()

    // What do you want to do with this return?
    // choose Enter and submit and continue
    cy.get('input#journey').check()
    cy.get('form > .govuk-button').click()

    // How was this return reported?
    // choose Abstraction volumes and continue
    cy.get('input#reported-2').check()
    cy.get('form > .govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('input#units').check()
    cy.get('form > .govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('input#meterProvided-2').check()
    cy.get('form > .govuk-button').click()

    // Is it a single volume?
    // choose Yes, enter 100 cubic metres and continue
    cy.get('input#singleVolume').check()
    cy.get('input#single-volume-quantity').type('100')
    cy.get('form > .govuk-button').click()

    // What period was used for this volume?
    // choose Default abstraction period and continue
    cy.get('input#periodDateUsedOptions').check()
    cy.get('form > .govuk-button').click()

    // Confirm this return
    cy.get('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel (with regex to accept any return number) and then click the Mark for supplementary bill run button
    cy.get('.govuk-panel__title').should('contain.text', 'Return 9999990 submitted')
    cy.get('.govuk-button').contains('Mark for supplementary bill run').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content').should(
      'contain.text',
      'This licence has been marked for the next two-part tariff supplementary bill run.'
    )
  })
})
