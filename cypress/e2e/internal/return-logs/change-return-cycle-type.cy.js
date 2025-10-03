'use strict'

import oneReturnRequirementWithFourReturnLogs from '../../../support/scenarios/one-return-requirement-four-return-logs.js'

const dataModel = oneReturnRequirementWithFourReturnLogs()

describe('Submit changing return cycle type on new return version', () => {
  beforeEach(() => {
    cy.tearDown()

    // Get the user email and login as the user
    cy.fixture('users.json').its('billingAndData').as('userEmail')
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31.
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')

      cy.load(dataModel)
    })
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.visit(`/system/licences/${dataModel.licences[0].id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    cy.get('#returns > .govuk-heading-l').contains('Returns')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const endYear = currentFinancialYearInfo.end.year

      cy.returnLogDueData(endYear, true).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(endYear - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains('complete')
      })

      cy.returnLogDueData(endYear - 2, true).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
      })

      cy.returnLogDueData(endYear - 3, true).then((data) => {
        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('complete')
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
      cy.get('#startDateYear').type(currentFinancialYearInfo.start.year - 2)
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
    cy.get('#setUpManually').check()
    cy.contains('Continue').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-l').contains('Select the purpose for the requirements for returns')

    // choose a purpose and add a purpose description for the requirement and continue
    cy.get('[data-test="purpose-0"]').check()
    cy.get('[data-test="purpose-alias-0"]').type('This is a purpose description')
    cy.contains('Continue').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-l').contains('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    cy.get('#points').check()
    cy.contains('Continue').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-l').contains('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    cy.get('#abstractionPeriodStartDay').type('01')
    cy.get('#abstractionPeriodStartMonth').type('12')
    cy.get('#abstractionPeriodEndDay').type('03')
    cy.get('#abstractionPeriodEndMonth').type('09')
    cy.contains('Continue').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-l').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#summer').check()
    cy.contains('Continue').click()

    // confirm we are on the site description page
    cy.get('.govuk-label').contains('Enter a site description for the requirements for returns')

    // enter a site description and continue
    cy.get('#siteDescription').type('This is a valid site description')
    cy.contains('Continue').click()

    // confirm we are on the readings collected page
    cy.get('.govuk-heading-l').contains('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    cy.get('#frequencyCollectedDay').check()
    cy.contains('Continue').click()

    // confirm we are on the readings reported page
    cy.get('.govuk-heading-l').contains('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    cy.get('#frequencyReportedDay').check()
    cy.contains('Continue').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose an agreement and exception and continue
    cy.get('#gravityFill').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
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
      const endYear = currentFinancialYearInfo.end.year

      cy.returnLogDueData(endYear, true).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-1"]').should('have.value', '')
      cy.get('[data-test="return-status-1"] > .govuk-tag').contains('not due yet')

      cy.returnLogDueData(endYear - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-3"]').should('have.value', '')
      cy.get('[data-test="return-status-3"] > .govuk-tag').contains('open')

      cy.returnLogDueData(endYear - 2, true).then((data) => {
        cy.get('[data-test="return-due-date-4"]').contains(data.text)
        cy.get('[data-test="return-status-4"] > .govuk-tag').contains('void')
      })

      cy.get('[data-test="return-due-date-5"]').should('have.value', '')
      cy.get('[data-test="return-status-5"] > .govuk-tag').contains('open')

      cy.returnLogDueData(endYear - 3, true).then((data) => {
        cy.get('[data-test="return-due-date-6"]').contains(data.text)
        cy.get('[data-test="return-status-6"] > .govuk-tag').contains('complete')
      })
    })
  })
})
