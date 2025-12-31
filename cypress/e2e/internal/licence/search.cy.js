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

    cy.log('Search for a licence by using Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('AT/TE/ST/01/01')
    cy.get('#search-button').click()
    cy.get('.searchresult-row').contains('AT/TE/ST/01/01')

    cy.log('Search for a licence by using Licence Number case sensitive')
    cy.get('#query').clear()
    cy.get('#query').type('at/te/st/01/01')
    cy.get('#search-button').click()
    cy.get('.searchresult-row').contains('AT/TE/ST/01/01')

    cy.log('Search for a licence by using partial Licence Number')
    cy.get('#query').clear()
    cy.get('#query').type('AT/TE/ST/01/0')
    cy.get('#search-button').click()
    cy.get('.searchresult-row').contains('AT/TE/ST/01/01')
  })
})
