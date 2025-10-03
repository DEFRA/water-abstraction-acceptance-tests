'use strict'

import scenarioData from '../../../support/scenarios/external-return-submission.js'

const scenario = scenarioData()

describe('Submit nil return (external)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('userEmail')
  })

  it('login as an existing user and submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/return?returnId=${scenario.returnLogs[0].id}`)

    // --> Have you extracted water in this period?
    // Click 'No' and continue
    cy.get('input[value="true"]').check()
    cy.get('form>.govuk-button').click()

    // Confirm and submit the details
    cy.get('h2.govuk-heading-l').should('contain.text', 'Nil return')
    cy.get('form>.govuk-button').click()

    // Confirm Return submitted
    cy.get('.panel__title').should('contain.text', 'Return submitted')
  })
})
