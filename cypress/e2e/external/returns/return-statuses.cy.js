'use strict'

import scenarioData from '../../../support/scenarios/external-return-statuses.js'

const scenario = scenarioData()

describe('Return statuses (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.load(scenario)
    cy.wrap(scenario.users[0].username).as('userEmail')
  })

  it('login as an existing user and view returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/licences`)

    // Select a licence to view returns and their status
    cy.contains('AT/CURR/DAILY/01').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')
    cy.get('.govuk-tag').should('not.contain.text', 'not yet due')
    cy.get(':nth-child(1) > :nth-child(4) > .govuk-tag').should('be.visible').and('contain.text', 'overdue')
    cy.get(':nth-child(2) > :nth-child(4) > .govuk-tag').should('be.visible').and('contain.text', 'due')
    cy.get(':nth-child(3) > :nth-child(4) > .govuk-tag').should('be.visible').and('contain.text', 'open')
    cy.get(':nth-child(4) > :nth-child(4) > .govuk-tag').should('be.visible').and('contain.text', 'complete')
  })
})
