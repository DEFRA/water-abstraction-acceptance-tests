'use strict'

describe('Make licence non-chargeable then see credit in next bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('create a SROC supplementary bill run, confirm and send it then make a licence non-chargeable using an SROC period date. Then create another SROC supplementary bill run and confirm a credit has been raised for the licence', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // -------------------------------------------------------------------------
    cy.log('Create, confirm and send the initial SROC supplementary bill run')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // we immediately select the SROC bill run. We don't expect it to be ready and to hit the spinner page but it
    // might be super quick and already done. So we do no checks at this point
    cy.get(':nth-child(2) > :nth-child(1) > .govuk-link').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('.govuk-button').contains('Confirm bill run').click()

    // You're about to send this bill run
    // click Send bill run
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'sending'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body > strong').should('contain.text', 'Sending')

    // Bill run sent
    // confirm the bill run is sent
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')

    // -------------------------------------------------------------------------
    cy.log('Make the licence non-chargeable')

    // Search
    // search for the licence and select it from the results
    cy.get('#navbar-view').click()
    cy.get('#query').type('AT/SROC/SUPB/02')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/SROC/SUPB/02').click()

    // Charge information
    // confirm we are on the licence page and select charge information tab. Then click to make the licence
    // non-chargeable
    cy.contains('AT/SROC/SUPB/02')
    cy.get('#tab_charge').click()
    cy.get('.govuk-button').contains('Make licence non-chargeable').click()

    // Why is this licence not chargeable?
    // choose Abatement (S126) and continue
    cy.get('input#reason').click()
    cy.get('.govuk-button').contains('Continue').click()

    // Enter effective date
    // choose another date, enter 30 June for the current financial year so only the last bill needs crediting (avoids
    // slowing the test down with unnecessary calculations for previous years) and continue
    cy.get('input#startDate-4').click()
    cy.currentFinancialYearDate(30, 6, -1).then((result) => {
      cy.get('input#customDate-day').type(result.day)
      cy.get('input#customDate-month').type(result.month)
      cy.get('input#customDate-year').type(result.year)
    })
    cy.get('.govuk-button').contains('Continue').click()

    // Check charge information
    // confirm the details and then click Confirm
    cy.get('dl').should('contain.text', 'This licence was made non-chargeable on')
    cy.get('dl > div > dd.govuk-summary-list__value').should('contain.text', 'Abatement (S126)')
    cy.get('.govuk-button').contains('Confirm').click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    cy.get('.govuk-panel__title').should('contain', 'Charge information complete')
    cy.get('a[href*="licences/"]').contains('View charge information').click()

    // Charge information
    // select to review it
    cy.get('#charge > table > tbody > tr:nth-child(1) > td:nth-child(5) > a').contains('Review').click()

    // Check charge information
    // approve the new charge version
    cy.get('strong.govuk-tag--orange').should('contain.text', 'Review')
    cy.get('input#reviewOutcome').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    cy.get('#charge > table > tbody > tr:nth-child(1)').within(() => {
      cy.get('td:nth-child(4) > strong').should('contain.text', 'Approved')
    })

    // -------------------------------------------------------------------------
    cy.log('Create the second SROC supplementary bill run and confirm credit generated')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // There is already a bill run in progress for this region
    // we expect this page because the PRESROC bill run takes precedence in the flow and we never confirmed the one
    // generated during the initial run
    cy.get('#main-content > div > div.govuk-grid-column-two-thirds > h1')
      .should('contain.text', 'There is already a bill run in progress for this region')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // we immediately select the SROC bill run. We don't expect it to be ready and to hit the spinner page but it
    // might be super quick and already done. So we do no checks at this point
    cy.get(':nth-child(1) > :nth-child(1) > .govuk-link').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run is a credit as expected
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content').should('contain.text', '1 credit note').and('contain.text', '0 invoices')
  })
})
