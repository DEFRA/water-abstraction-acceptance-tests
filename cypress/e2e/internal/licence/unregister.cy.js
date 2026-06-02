'use strict'

import scenarioData from '../../../support/scenarios/user-registered-to-licence.js'

const scenario = scenarioData()

describe('Unregister a licence (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario).as('scenario')

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('can unregister a licence from its primary user', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the user and then select it
    cy.get('#query').clear()
    cy.get('@scenario').then((scenario) => {
      const externalUserEmail = scenario.users[0].username

      cy.get('#query').type(externalUserEmail)
      cy.get('#search-button').click()
      cy.get('.searchresult-row').contains(externalUserEmail)
    })
    cy.get('.searchresult-link').click()

    // Select the external user's licences page
    cy.get(':nth-child(2) > .x-govuk-sub-navigation__link').click()

    // Start the unregister licence journey
    cy.get('.govuk-button').contains('Unregister licence').click()

    // Select the licence to be unregistered
    cy.get('@scenario').then((scenario) => {
      cy.get('.govuk-label').contains(scenario.licences[0].licenceRef)
      cy.get('#licences-item-hint').contains(scenario.companies[0].name)
    })
    cy.get('[name="licences"]').click()
    cy.get('.govuk-button').contains('Continue').click()

    // Check licences to unregister
    cy.get('@scenario').then((scenario) => {
      // cy.get(`.govuk-!-margin-bottom-1`).contains(scenario.licences[0].licenceRef)
      cy.get('#main-content > dl > div > dd.govuk-summary-list__value > p').contains(scenario.licences[0].licenceRef)
    })
    cy.get('button.govuk-button').contains('Confirm').click()

    // Returned to the external user's licences page
    // Confirm user sees a notification and the licence is no longer shown
    cy.get('.govuk-notification-banner__heading').contains('Licences unregistered').should('be.visible')
    cy.get('[data-test="no-licences-msg"]').contains('This user has no linked licences.').should('be.visible')

    // Confirm the licence is now shown as unregistered
    cy.get('#nav-search').click()

    cy.get('#query').clear()
    cy.get('@scenario').then((scenario) => {
      const licenceRef = scenario.licences[0].licenceRef

      cy.get('#query').type(licenceRef)
      cy.get('#search-button').click()
      cy.get('.searchresult-row').contains(licenceRef)
    })
    cy.get('.searchresult-link').click()

    cy.get('.govuk-caption-l').contains('Unregistered licence')
  })
})
