'use strict'

import scenarioData from '../../../support/scenarios/one-licence-only.js'

const scenario = scenarioData()

describe('Search for a licence (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can find a licence using various search values', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    cy.log('Search for a license by using Licence holder Name')
    cy.get('#query').type('cupcake factory')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using Licence name or Licence alias')
    cy.get('#query').clear()
    cy.get('#query').type('daily cupcake')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using Licence name or Licence alias in upper case')
    cy.get('#query').clear()
    cy.get('#query').type('DAILY CUPCAKE')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using Licence Number case sensitive')
    cy.get('#query').clear()
    cy.get('#query').type('at/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using partial Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('at/CURR/DAILY/0')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01')

    cy.log('Search for a license by using partial name')
    cy.get('#query').clear()
    cy.get('#query').type('factory')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__body').contains('AT/CURR/DAILY/01')
    cy.get('.govuk-table__body').contains('the daily cupcake licence')

    cy.log('Search for a license by using partial name')
    cy.get('#query').clear()
    cy.get('#query').type('daily cupcake')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__body').contains('AT/CURR/DAILY/01')
    cy.get('.govuk-table__body').contains('the daily cupcake licence')
  })
})
