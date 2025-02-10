'use strict'

describe('Submit a return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return for a licence from its returns tab and mark the licence for supplementary billing', () => {
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

    // confirm we see the due return
    cy.get('#returns').within(() => {
      cy.get('.govuk-table__row:nth-child(2)').should('be.visible').and('contain.text', '9999992')
      cy.get('.govuk-table__row:nth-child(2)').should('be.visible').and('contain.text', 'overdue')

      cy.get('.govuk-table__row:nth-child(2) a').contains('9999992').click()
    })

    // What do you want to do with this return?
    // choose Enter and submit and continue
    cy.get('input#action').check()
    cy.get('form > .govuk-button').click()

    // When was the return received?
    // choose Today and continue
    cy.get('input#receivedDate').check()
    cy.get('form > .govuk-button').click()

    // Has water been abstracted in this return period?
    // choose Yes and continue
    cy.get('input#isNil').check()
    cy.get('form > .govuk-button').click()

    // How was this return reported?
    // choose Abstraction volumes and continue
    cy.get('input#method-2').check()
    cy.get('form > .govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('input#units').check()
    cy.get('form > .govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('input#meterDetailsProvided-2').check()
    cy.get('form > .govuk-button').click()

    // Did they use a meter or meters?
    // choose No and continue
    cy.get('input#meterUsed-2').check()
    cy.get('form > .govuk-button').click()

    // Is it a single volume?
    // choose Yes, enter 100 cubic metres and continue
    cy.get('input#isSingleTotal').check()
    cy.get('input#total').type('100')
    cy.get('form > .govuk-button').click()

    // What period was used for this volume?
    // choose Default abstraction period and continue
    cy.get('input#totalCustomDates').check()
    cy.get('form > .govuk-button').click()

    // Volumes
    // we leave the defaulted values of 50CM, which are 100CM split by the number of months in the abstraction
    // period (2) and continue
    cy.get('form > .govuk-button').click()

    // Confirm this return
    // confirm we are seeing the details we entered then submit
    cy.get('table > tbody').within(() => {
      cy.get('tr:nth-child(1) > td:nth-child(1)').should('contain.text', 'January')
      cy.get('tr:nth-child(1) > td:nth-child(2)').should('contain.text', '50')

      cy.get('tr:nth-child(2) > td:nth-child(1)').should('contain.text', 'February')
      cy.get('tr:nth-child(2) > td:nth-child(2)').should('contain.text', '50')

      cy.get('tr:nth-child(3) > td:nth-child(1)').should('contain.text', 'Total volume of water abstracted')
      cy.get('tr:nth-child(3) > td:nth-child(2)').should('contain.text', '100')
    })
    cy.get('form > .govuk-button').contains('Submit').click()

    // Return submitted
    // confirm we see the success panel and then click the Mark for supplementary bill run button
    cy.get('.panel').should('contain.text', 'Return submitted')
    cy.get('.govuk-grid-column-two-thirds > .govuk-button').contains('Mark for supplementary bill run').click()

    // You're about to mark this licence for the next supplementary bill run
    // only options is to confirm or go back. We click the confirm button
    cy.get('form > .govuk-button').contains('Confirm').click()

    // You've marked this licence for the next supplementary bill run
    // confirm we see the success panel and then click the link to return to the licence
    cy.get('.govuk-panel').should('contain.text', "You've marked this licence for the next supplementary bill run")
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
