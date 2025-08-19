'use strict'

describe('Submit summer and winter and all year historic correction using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31.
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')

      const winter = { start: currentFinancialYearInfo.start.year, end: currentFinancialYearInfo.end.year }
      const summer = { start: currentFinancialYearInfo.start.year - 1, end: currentFinancialYearInfo.end.year - 1 }

      cy.fixture('return-logs-historic-02.json').then((fixture) => {
        fixture.returnLogs[0].id = `v1:9:AT/CURR/DAILY/01:9999990:${winter.start}-04-01:${winter.end}-03-31`
        fixture.returnLogs[0].dueDate = `${winter.end}-04-28`
        fixture.returnLogs[0].endDate = `${winter.end}-03-31`
        fixture.returnLogs[0].startDate = `${winter.start}-04-01`
        fixture.returnLogs[0].returnCycleId.value = `${winter.start}-04-01`

        fixture.returnLogs[1].id = `v1:9:AT/CURR/DAILY/01:9999991:${summer.start}-11-01:${summer.end}-10-31`
        fixture.returnLogs[1].dueDate = `${summer.end}-11-28`
        fixture.returnLogs[1].endDate = `${summer.end}-10-31`
        fixture.returnLogs[1].startDate = `${summer.start}-11-01`
        fixture.returnLogs[1].returnCycleId.value = `${summer.start}-11-01`

        fixture.returnLogs[2].id = `v1:9:AT/CURR/DAILY/01:9999990:${winter.start - 1}-04-01:${winter.end - 1}-03-31`
        fixture.returnLogs[2].dueDate = `${winter.end - 1}-04-28`
        fixture.returnLogs[2].endDate = `${winter.end - 1}-03-31`
        fixture.returnLogs[2].startDate = `${winter.start - 1}-04-01`
        fixture.returnLogs[2].returnCycleId.value = `${winter.start - 1}-04-01`

        fixture.returnLogs[3].id = `v1:9:AT/CURR/DAILY/01:9999991:${summer.start - 1}-11-01:${summer.end - 1}-10-31`
        fixture.returnLogs[3].dueDate = `${summer.end - 1}-11-28`
        fixture.returnLogs[3].endDate = `${summer.end - 1}-10-31`
        fixture.returnLogs[3].startDate = `${summer.start - 1}-11-01`
        fixture.returnLogs[3].returnCycleId.value = `${summer.start - 1}-11-01`

        cy.load(fixture)
      })
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a return requirement using abstraction data and approves the requirement', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('#email').type(userEmail)
    })

    cy.get('#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('form > .govuk-button').click()

    // assert the user signed in and we're on the search page
    cy.contains('Search')

    // search for a licence
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page
    cy.contains('AT/CURR/DAILY/01')

    // click returns tab
    cy.contains('Returns').click()

    // confirm we are on the licence returns tab and that there are previous return logs
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const winter = { start: currentFinancialYearInfo.start.year, end: currentFinancialYearInfo.end.year }
      const summer = { start: currentFinancialYearInfo.start.year - 1, end: currentFinancialYearInfo.end.year - 1 }

      cy.returnLogDueData(winter.end, true).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(summer.end, false).then((data) => {
        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(winter.end - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains('complete')
      })

      cy.returnLogDueData(summer.end - 1, false).then((data) => {
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

    // set the start date to be the beginning of the current winter and all year cycle
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('01')
    cy.get('#other-start-date-month').type('04')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      cy.get('#other-start-date-year').type(currentFinancialYearInfo.start.year)
    })
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-heading-l').contains('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    cy.get('#reason-10').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-heading-l').contains('How do you want to set up the requirements for returns?')

    // choose copy from existing requirements and continue
<<<<<<< HEAD
    cy.get('#method').check()
=======
    cy.get('#method-2').check()
    cy.contains('Continue').click()

    // confirm we are on the existing requirements page
    cy.get('.govuk-heading-l').contains('Use previous requirements for returns')

    // choose a previous requirements for returns and continue
    cy.get('#existing').check()
>>>>>>> baa51a4 (Update return log historic changes tests (#172))
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
      const winter = { start: currentFinancialYearInfo.start.year, end: currentFinancialYearInfo.end.year }
      const summer = { start: currentFinancialYearInfo.start.year - 1, end: currentFinancialYearInfo.end.year - 1 }

      cy.returnLogDueData(winter.end, true).then((data) => {
        cy.get('[data-test="return-due-date-0"]').contains(data.text)
        cy.get('[data-test="return-status-0"] > .govuk-tag').contains('void')

        cy.get('[data-test="return-due-date-1"]').contains(data.text)
        cy.get('[data-test="return-status-1"] > .govuk-tag').contains(data.label)

        cy.get('[data-test="return-due-date-2"]').contains(data.text)
        cy.get('[data-test="return-status-2"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(summer.end, false).then((data) => {
        cy.get('[data-test="return-due-date-3"]').contains(data.text)
        cy.get('[data-test="return-status-3"] > .govuk-tag').contains('void')

        cy.get('[data-test="return-due-date-4"]').contains(data.text)
        cy.get('[data-test="return-status-4"] > .govuk-tag').contains(data.label)
      })

      cy.returnLogDueData(winter.end - 1, true).then((data) => {
        cy.get('[data-test="return-due-date-5"]').contains(data.text)
        cy.get('[data-test="return-status-5"] > .govuk-tag').contains('complete')
      })

      cy.returnLogDueData(summer.end - 1, false).then((data) => {
        cy.get('[data-test="return-due-date-6"]').contains(data.text)
        cy.get('[data-test="return-status-6"] > .govuk-tag').contains('complete')
      })
    })
  })
})
