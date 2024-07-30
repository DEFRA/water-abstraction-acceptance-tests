'use strict'

describe('Search for a licence (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can find a licence using various search values', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    cy.log('Search for a license by using Licence holder Name')
    cy.get('#query').type('barber bakery')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using Licence name or Licence alias')
    cy.get('#query').clear()
    cy.get('#query').type(' weekly crumpet')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using Licence name or Licence alias in upper case')
    cy.get('#query').clear()
    cy.get('#query').type(' WEEKLY CRUMPET')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('AT/CURR/WEEKLY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using Licence Number case sensitive')
    cy.get('#query').clear()
    cy.get('#query').type('at/CURR/WEEKLY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using partial Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('at/CURR/WEEKLY/0')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/WEEKLY/01')

    cy.log('Search for a license by using partial name')
    cy.get('#query').clear()
    cy.get('#query').type('shop')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__body').contains('AT/CURR/MONTHLY/01')
    cy.get('.govuk-table__body').contains('the monthly pie licence')

    cy.log('Search for a license by using partial name')
    cy.get('#query').clear()
    cy.get('#query').type('doughnut store')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__body').contains('AT/CURR/MONTHLY/02')
    cy.get('.govuk-table__body').contains('the monthly doughnut licence')
  })
})
