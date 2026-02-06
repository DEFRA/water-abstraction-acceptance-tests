import scenarioData from '../../../../support/scenarios/two-part-tariff-supplementary.js'

const scenario = scenarioData()

describe('Send a two-part tariff supplementary bill run where licence is current and not in workflow, has one applicable charge version with a single charge reference and element both of which are 2pt. It has two returns, both of which match the charge element exactly match', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31.
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
    })

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates an SROC TPT bill run and once built completes the review, marks the bill run as READY, and then SENDS it', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/system/bill-runs')

    // Bill runs
    // click the Create a bill run button
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Two-part tariff then continue
    cy.get('label.govuk-radios__label').contains('Two-part tariff supplementary').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // choose top option and continue
    cy.get('#year').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check the bill run
    cy.get('.govuk-button').contains('Create bill run').click()

    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status REVIEW, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'review')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="bill-run-total-0"]').should('contain.text', '')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Review licences ~ Test its the correct bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'review')
    cy.get('h1').should('contain.text', 'Review licences')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Two-part tariff supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')

    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const financialYearText = `${currentFinancialYearInfo.start.year - 1} to ${currentFinancialYearInfo.end.year - 1}`

      cy.get('[data-test="meta-data-year"]').should('contain.text', financialYearText)
    })

    // Continue the bill run which will mark it as READY
    cy.get('.govuk-button').contains('Continue bill run').click()

    // Wait for the bill run to complete building
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'ready')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Send the bill run (it is double because you click the same button on the confirm page)
    cy.get('.govuk-button').contains('Send bill run').click()
    cy.get('.govuk-button').contains('Send bill run').click()

    // Sending page
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // confirm we see it is now SENT
    cy.get('#main-content > p > .govuk-tag').should('contain.text', 'sent')
  })
})
