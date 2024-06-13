'use strict'

describe('Testing a two-part tariff bill run with a similar licence to scenario one, licence is current and not in workflow, it has one applicable charge version with a single charge reference but it has two charge element only one of which is 2pt. It also has two return, one 2pt and one not', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('sroc-two-part-tariff-scenario-three-data.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData1').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns and allocated quantities', () => {
    cy.visit('/')

    // Enter the user name and password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })

    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // Click the Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // Click the Create a bill run button
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // Choose Two-part tariff then continue
    cy.get('label.govuk-radios__label').contains('Two-part tariff').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // Choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // Choose 2021 to 2022 and continue
    cy.get('label.govuk-radios__label').contains('2022 to 2023').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status REVIEW, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'review')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Review licences ~ Test its the correct bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'review')
    cy.get('h1').should('contain.text', 'Review licences')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('[data-test="meta-data-year"]').should('contain.text', '2022 to 2023')

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', '')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff bill run')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2022 to 31 March 2023')

    // Review Licence AT/TEST/01 ~ Check the Licence links
    cy.get('[data-test="summary-link"] > .govuk-link').should('exist')
    cy.get('[data-test="returns-link"] > .govuk-link').should('exist')
    cy.get('[data-test="charge-information-link"] > .govuk-link').should('exist')
    cy.get('[data-test="charge-period-0"]').should('exist')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('exist')

    // Review Licence AT/TEST/01 ~ Check the first matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"]').should('contain.text', '32 ML / 32 ML')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('not.exist')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details
    cy.get('[data-test="financial-year"]').should('contain.text', 'Financial year 2022 to 2023')
    cy.get('#charge-version-0 > .govuk-heading-l').should('contain.text', 'Charge periods 1 April 2022 to 31 March 2023')
    cy.get('[data-test="licence-holder"]').should('contain.text', 'Mr J J Testerson')
    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="billing-account"]').should('contain.text', 'A99999991A')
    cy.get('[data-test="account-name"]').should('contain.text', 'Big Farm Co Ltd 01')
    cy.get('[data-test="reference-0"]').should('contain.text', 'Charge reference 4.6.11')
    cy.get('[data-test="charge-description-0"]').should('contain.text', 'High loss, non-tidal, restricted water, greater than 15 up to and including 50 ML/yr, Tier 1 model')
    cy.get('[data-test="total-billable-returns-0"]').should('contain.text', '28.4 ML / 32 ML')
    cy.get('[data-test="charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="element-count-0"]').should('contain.text', 'Element 1 of 1')
    cy.get('[data-test="element-description-0"]').should('contain.text', 'SROC Charge Purpose 01')
    cy.get('[data-test="element-dates-0"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-element-issues-0"]').should('contain.text', '')
    cy.get('[data-test="charge-element-billable-returns-0"]').should('contain.text', '28.4 ML / 32 ML')
    cy.get('[data-test="charge-element-return-volumes-0"]').should('contain.text', '28.4 ML (10055412)')

    // Review Licence AT/TEST/01 ~ Check there is only 1 charge version, charge reference and charge element
    cy.get('#charge-version-1 > .govuk-heading-l').should('not.exist')
    cy.get('[data-test="charge-reference-1"]').should('not.exist')
    cy.get('[data-test="element-count-1"]').should('not.exist')
    cy.get('[data-test="charge-reference-link-0"]').click()

    // Charge reference details
    cy.get('[data-test="charge-reference"]').should('contain.text', 'Charge reference 4.6.11')
    cy.get('[data-test="charge-reference-description"]').should('contain.text', 'High loss, non-tidal, restricted water, greater than 15 up to and including 50 ML/yr, Tier 1 model')
    cy.get('[data-test="financial-year"]').should('contain.text', 'Financial Year 2022 to 2023')
    cy.get('[data-test="charge-period"]').should('contain.text', 'Charge period 1 April 2022 to 31 March 2023')
    cy.get('[data-test="total-billable-returns"]').should('contain.text', '28.4 ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32 ML')
    cy.get('[data-test="additional-charges"]').should('contain.text', 'Public Water Supply')
    cy.get('[data-test="adjustment-0"]').should('contain.text', 'Two part tariff agreement')
    cy.get('.govuk-back-link').click()

    // View match details
    cy.get('[data-test="charge-element-match-details-0"]').click()
    cy.get('.govuk-heading-l').contains('SROC Charge Purpose 01')
    cy.get('.govuk-heading-l').contains('1 April 2022 to 31 March 2023')
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="financial-year"]').should('contain.text', 'Financial year 2022 to 2023')
    cy.get('[data-test="charge-period"]').should('contain.text', 'Charge period 1 April 2022 to 31 March 2023')
    cy.get('[data-test="billable-returns"]').should('contain.text', '28.4ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32ML')
    cy.get('[data-test="issues-0"]').should('not.exist')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10055412')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('Spray Irrigation - Direct A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '28.4 ML / 28.4 ML')
  })
})
