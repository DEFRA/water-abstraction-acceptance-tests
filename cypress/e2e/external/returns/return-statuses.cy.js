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
    cy.env(['externalUrl']).then(({ externalUrl }) => {
      cy.visit(`${externalUrl}/licences`)
    })

    // Select a licence to view returns and their status
    cy.contains('AT/TE/ST/01/01').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')

    cy.get('#returns > .govuk-table > .govuk-table__body').within(() => {
      cy.get('.govuk-tag').should('not.contain.text', 'not yet due')
      cy.get('.govuk-tag').should('not.contain.text', 'void')

      cy.contains('9999991').parent('td').parent('tr').find('td:nth-child(4) .govuk-tag').should('contain.text', 'complete')

      cy.contains('9999993').parent('td').parent('tr').find('td:nth-child(4) .govuk-tag').should('contain.text', 'open')

      cy.contains('9999994').parent('td').parent('tr').find('td:nth-child(4) .govuk-tag').should('contain.text', 'due')

      cy.contains('9999995').parent('td').parent('tr').find('td:nth-child(4) .govuk-tag').should('contain.text', 'overdue')
    })
  })
})
