'use strict'

import externalReturnSubmission from '../../../support/scenarios/external-return-submission.js'

const externalReturnSubmissionScenario = externalReturnSubmission()

describe('Submit nil return (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.load(externalReturnSubmissionScenario)
    cy.wrap(externalReturnSubmissionScenario.users[0].username).as('userEmail')
  })

  it('login as an existing user and submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/licences`)

    // Select a licence to submit returns for
    cy.contains('AT/CURR/DAILY/01').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')

    // Start the return journey - return reference 9999990
    cy.get('#returns > .govuk-table > .govuk-table__body > .govuk-table__row > [scope="row"] > a').click()

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
