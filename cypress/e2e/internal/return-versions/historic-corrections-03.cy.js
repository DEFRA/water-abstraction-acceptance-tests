'use strict'

import scenarioData from '../../../support/scenarios/two-return-requirements-three-return-logs.js'

const scenario = scenarioData()

describe('Submit historic correction using abstraction data for two abstraction points', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31.
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    cy.get('#returns > .govuk-heading-l').contains('Returns')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.start.year
      const endYear = currentFinancialYearInfo.end.year

      cy.returnLogDueData(endYear, true).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains(data.label)

        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(startYear, true).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')
      })

      cy.returnLogDueData(startYear - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-4"]').contains(data.text)
        cy.get('[data-test="return-status-4"] > .govuk-tag').contains('complete')
        cy.get('[data-test="return-due-date-5"]').contains(data.text)
        cy.get('[data-test="return-status-5"] > .govuk-tag').contains('complete')
      })
    })

    // click licence set up tab
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // set the start date to be 2 years in the past
    cy.get('#anotherStartDate').check()
    cy.get('#startDateDay').type('01')
    cy.get('#startDateMonth').type('11')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.start.year

      cy.get('#startDateYear').type(startYear - 2)
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

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    cy.contains('Return to licence set up').click()
    cy.contains('Returns').click()

    // confirm we are on the licence set up tab
    cy.get('#returns > .govuk-heading-l').contains('Returns')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const startYear = currentFinancialYearInfo.start.year
      const endYear = currentFinancialYearInfo.end.year

      cy.get('[data-test="return-due-date-0"]').should('have.value', '')
      cy.get('[data-test="return-status-0"] > .govuk-tag').contains('not due yet')

      cy.get('[data-test="return-due-date-1"]').should('have.value', '')
      cy.get('[data-test="return-status-1"] > .govuk-tag').contains('not due yet')

      cy.returnLogDueData(endYear, true).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('void')

        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-4"]').should('have.value', '')
      cy.get('[data-test="return-status-4"] > .govuk-tag').contains('open')

      cy.get('[data-test="return-due-date-5"]').should('have.value', '')
      cy.get('[data-test="return-status-5"] > .govuk-tag').contains('open')

      cy.returnLogDueData(startYear, true).then((data) => {
        cy.get('[data-test="return-due-date-6"]').contains(data.text)
        cy.get('[data-test="return-status-6"] > .govuk-tag').contains('void')

        cy.get('[data-test="return-due-date-7"]').contains(data.text)
        cy.get('[data-test="return-status-7"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-8"]').should('have.value', '')
      cy.get('[data-test="return-status-8"] > .govuk-tag').contains('open')

      cy.get('[data-test="return-due-date-9"]').should('have.value', '')
      cy.get('[data-test="return-status-9"] > .govuk-tag').contains('open')

      cy.get('[data-test="return-due-date-10"]').should('have.value', '')
      cy.get('[data-test="return-status-10"] > .govuk-tag').contains('open')

      cy.returnLogDueData(startYear - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-11"]').contains(data.text)
        cy.get('[data-test="return-status-11"] > .govuk-tag').contains('void')

        cy.get('[data-test="return-due-date-12"]').contains(data.text)
        cy.get('[data-test="return-status-12"] > .govuk-tag').contains('void')
      })
    })
  })
})
