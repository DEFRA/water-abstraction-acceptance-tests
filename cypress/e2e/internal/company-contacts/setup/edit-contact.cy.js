'use strict'

import scenarioData from '../../../../support/scenarios/company-contact.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'

const scenario = scenarioData()

describe("Edit licence holder contacts (internal)", () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can edit a contact to change its abstraction alerts', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/companies/${scenario.companies[0].id}/contacts`)

    const contact = scenario.contacts[0]

    // Confirm the seeded contact exists
    cy.get('[data-test="contact-name-1"]').should('contain.text', contact.department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Additional contact')

    // View the contact details
    cy.contains('.govuk-table__row', contact.department).within(() => {
      cy.get('a').click()
    })

    cy.get('h1.govuk-heading-l').should('have.text', `Contact details for ${contact.department}`)

    cy.contains('.govuk-summary-list__row', 'Name').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.department)
    })

    cy.contains('.govuk-summary-list__row', 'Email address').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.email)
    })

    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', 'No')
    })

    // Edit the contact
    cy.get('.govuk-button').contains('Edit contact').click()

    cy.contains('.govuk-summary-list__row', 'Name').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.department)
    })

    cy.contains('.govuk-summary-list__row', 'Email address').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.email)
    })

    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', 'No')
    })

    // Change the abstraction alerts to yes, for some licences
    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.contains('Change').click()
    })

    cy.get('input[name="abstractionAlerts"][value="some"]').check()
    cy.contains('Continue').click()

    // Select at least one licence on the select licences page
    cy.get('input[type="checkbox"]').first().check()
    cy.contains('Continue').click()

    // Check the change has been applied on the check contact page
    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.get('.govuk-summary-list__value')
        .should('include.text', 'Yes, for some licences')
        .and('include.text', scenario.licences[0].licenceRef)
    })

    // Confirm the change
    cy.contains('Confirm').click()

    // Check the contact details page reflects the change
    cy.get('.govuk-caption-l').should('contain.text', scenario.companies[0].name)
    cy.get('h1.govuk-heading-l').should('have.text', `Contact details for ${contact.department}`)

    cy.contains('.govuk-summary-list__row', 'Name').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.department)
    })

    cy.contains('.govuk-summary-list__row', 'Email address').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.email)
    })

    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.get('.govuk-summary-list__value')
        .should('include.text', 'Yes, for some licences')
        .and('include.text', scenario.licences[0].licenceRef)
    })

    cy.contains('.govuk-summary-list__row', 'Last updated').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', formatLongDate(new Date()))
    })

    // Confirm the main contacts page reflects the change
    cy.visit(`/system/companies/${scenario.companies[0].id}/contacts`)

    cy.get('[data-test="contact-name-1"]').should('contain.text', contact.department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Abstraction alerts')
  })
})
