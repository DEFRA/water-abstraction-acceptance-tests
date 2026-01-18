'use strict'

import scenarioData from '../../../support/scenarios/one-return-requirement-quarterly-returns.js'

const scenario = scenarioData()

describe('Submit winter and all year quarterly historic correction using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')

    cy.quarterlyPeriods().then((periods) => {
      cy.wrap(periods).as('periods')
    })
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    cy.get('h1').should('contain.text', 'Returns')

    cy.get('@periods').then((periods) => {
      const year = periods.year

      cy.quarterlyReturnLogDueData(`${year + 1}-04-28`).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains(data.label)
      })

      cy.quarterlyReturnLogDueData(`${year + 1}-01-28`).then((data) => {
        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains('complete')
      })

      cy.quarterlyReturnLogDueData(`${year}-10-28`).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
      })

      cy.quarterlyReturnLogDueData(`${year}-07-28`).then((data) => {
        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')
      })
    })

    // click licence set up tab
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // set the start date to be at the start of the all year return cycle
    cy.get('#anotherStartDate').check()
    cy.get('#startDateDay').type('01')
    cy.get('#startDateMonth').type('04')
    cy.get('@periods').then((periods) => {
      cy.get('#startDateYear').type(periods.year)
    })
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-heading-l').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#newLicence').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-heading-l').contains('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    cy.get('#useAbstractionData').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // click on the change link for addiontal submission options
    cy.get('[data-test="change-additional-submission-options"]').click()

    // click Continue
    cy.get('.govuk-button').contains('Continue').click()

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    cy.contains('Return to licence set up').click()
    cy.contains('Returns').click()

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Returns')

    cy.get('@periods').then((periods) => {
      const year = periods.year

      cy.get('[data-test="return-due-date-0"]').should('have.value', '')
      cy.get('[data-test="return-status-0"] > .govuk-tag').contains(periods.q4.status)

      cy.quarterlyReturnLogDueData(`${year + 1}-04-28`).then((data) => {
        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-2"]').should('have.value', '')
      cy.get('[data-test="return-status-2"] > .govuk-tag').contains(periods.q3.status)

      cy.quarterlyReturnLogDueData(`${year + 1}-01-28`).then((data) => {
        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-4"]').should('have.value', '')
      cy.get('[data-test="return-status-4"] > .govuk-tag').contains(periods.q2.status)

      cy.quarterlyReturnLogDueData(`${year}-10-28`).then((data) => {
        cy.get('[data-test="return-due-date-5"]').contains(data.text)
        cy.get('[data-test="return-status-5"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-6"]').should('have.value', '')
      cy.get('[data-test="return-status-6"] > .govuk-tag').contains(periods.q1.status)

      cy.quarterlyReturnLogDueData(`${year}-07-28`).then((data) => {
        cy.get('[data-test="return-due-date-7"]').contains(data.text)
        cy.get('[data-test="return-status-7"] > .govuk-tag').contains('void')
      })
    })
  })
})
