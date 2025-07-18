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
    cy.get('.govuk-panel').should('contain.text', 'Return 9999992 submitted')
    cy.get('.govuk-button').contains('Mark for supplementary bill run').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content').should(
      'contain.text',
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
