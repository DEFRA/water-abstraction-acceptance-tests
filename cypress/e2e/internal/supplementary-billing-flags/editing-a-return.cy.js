'use strict'

describe('Editing a return', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('editing-a-return.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return for a licence from its returns tab and mark the licence for two-part tariff supplementary billing', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // assert the user signed in and we're on the search page
    cy.contains('Search')

    // search for a licence
    cy.get('#query').type('AT/CURR/MONTHLY/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/MONTHLY/02').click()

    // confirm we are on the licence page and select returns tab
    cy.contains('AT/CURR/MONTHLY/02')
    cy.get('[data-test="#tab_returns"]').click()

    // confirm we are on the tab page
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    // confirm we see the return we are going to edit
    cy.get('#returns').within(() => {
      cy.get('[data-test="return-reference-2"] > .govuk-link').should('be.visible').and('contain.text', '9999994')
      cy.get('[data-test="return-status-2"] > .govuk-tag').should('be.visible').and('contain.text', 'complete')

      cy.get('[data-test="return-reference-2"] > .govuk-link').contains('9999994').click()
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
    // confirm we are seeing the details we entered then submit
    cy.get('table > tbody').within(() => {
      cy.get(':nth-child(10) > :nth-child(1)').should('contain.text', 'January')
      cy.get(':nth-child(10) > .govuk-table__cell--numeric').should('contain.text', '50')

      cy.get(':nth-child(11) > :nth-child(1)').should('contain.text', 'February')
      cy.get(':nth-child(11) > .govuk-table__cell--numeric').should('contain.text', '50')

      cy.get('td.govuk-table__cell.govuk-table__header').should('contain.text', 'Total volume of water abstracted')
      cy.get('.govuk-table__cell > strong').should('contain.text', '100')
    })
    cy.get('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel (with regex to accept any return number) and then click the Mark for supplementary bill run button
    cy.get('.govuk-panel__title').should('contain.text', 'Return 9999994 submitted')
    cy.get('.govuk-button').contains('Mark for supplementary bill run').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content').should(
      'contain.text',
      'This licence has been marked for the next two-part tariff supplementary bill run.'
    )
  })
})
