'use strict'

import scenarioData from '../../../support/scenarios/sharing-access.js'

const scenario = scenarioData()

describe('Sharing license access with a new user (external)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('firstUserEmail')
    cy.wrap('external.new@example.com').as('secondUserEmail')
  })

  it('allows a user to grant access to a licence to new user', () => {
    cy.get('@firstUserEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.env(['externalUrl']).then(({ externalUrl }) => {
      cy.visit(`${externalUrl}/manage_licences`)
    })

    cy.get('.govuk-list').contains('Give or remove access to your licence information').click()
    cy.get('.govuk-button').contains('Give access').click()
    cy.get('@secondUserEmail').then((email) => {
      cy.get('input#email').type(email)
    })
    cy.get('#returns').check()
    cy.get('.form > .govuk-button').click()

    // First user logs out
    cy.get('.govuk-link').contains('Return to give access').click()
    cy.get('#signout').click()

    // Second user registers using link in email received
    cy.get('@secondUserEmail').then((email) => {
      cy.lastNotification(email).then((body) => {
        cy.env(['externalUrl']).then(({ externalUrl }) => {
          cy.extractNotificationLink(body, 'link', externalUrl).then((link) => {
            cy.visit(link)
          })
        })

        cy.env(['defaultPassword']).then(({ defaultPassword }) => {
          cy.get('input#password').type(defaultPassword)
          cy.get('input#confirmPassword').type(defaultPassword)
          cy.get('form').submit()
        })

        // Second user logs in using the new account to confirm the registration was successful
        cy.get('#email').type(email)
        cy.env(['defaultPassword']).then(({ defaultPassword }) => {
          cy.get('#password').type(defaultPassword)
          cy.get('button.govuk-button').click()
        })

        // Assert they can see the same licence
        cy.get('.licence-result__column > a').contains('AT/TE/ST/01/01').should('be.visible')

        // Sign out
        cy.get('#signout').click()
      })
    })
  })
})
