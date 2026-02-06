'use strict'

import scenarioData from '../../../support/scenarios/two-return-requirements-with-points.js'

const scenario = scenarioData()

describe('Submit returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a return requirement and approves the requirement', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    cy.visit(`/system/licences/${scenario.licences[0].id}/set-up`)

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // choose the licence version start date and click continue
    cy.get('#licenceStartDate').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-heading-l').contains('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    cy.get('#changeToSpecialAgreement').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-heading-l').contains('How do you want to set up the requirements for returns?')

    // click set up manually and continue
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
    cy.get('h1').should('have.text', 'Enter a site description for the requirements for returns')

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

    // confirm we see the start date information we expect
    cy.get('[data-test="start-date"]').contains('1 January 2018')

    // choose the change option for the start date
    cy.get('[data-test="change-start-date"]').click()

    // change start date and continue
    cy.get('#anotherStartDate').check()
    cy.get('#startDateDay').type('02')
    cy.get('#startDateMonth').type('08')
    cy.get('#startDateYear').type('2023')
    cy.contains('Continue').click()

    // confirm we are back on check page and see the start date changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="start-date"]').contains('2 August 2023')

    // confirm we see the reason we selected
    cy.get('[data-test="reason"]').contains('Change to special agreement')

    // choose the change option for reason
    cy.get('[data-test="change-reason"]').click()

    // change the reason and continue
    cy.get('#minorChange').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the reason changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="reason"]').contains('Minor change')

    // confirm we see the purposes selected
    cy.get('[data-test="purposes-0"]').should('contain', 'General Farming & Domestic (This is a purpose description)')

    // choose the change option for purposes
    cy.get('[data-test="change-purposes-0"]').click()

    // change the purpose and purpose description and click continue
    cy.get('[data-test="purpose-0"]').uncheck()
    cy.get('[data-test="purpose-1"]').check()
    cy.get('[data-test="purpose-alias-1"]').type('This is another purpose description')
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the purpose changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="purposes-0"]').contains('Make-Up Or Top Up Water (This is another purpose description)')

    // confirm we see the points selected
    cy.get('[data-test="points-0"]').should('contain', 'At National Grid Reference TQ 1234 5678 (Example point 1)')

    // choose the change option for points
    cy.get('[data-test="change-points-0"]').click()

    // change the points and continue
    cy.get('#points').uncheck()
    cy.get('#points-2').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the points changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TT 9876 5432 (Example point 2)')

    // confirm we see the abstraction period selected
    cy.get('[data-test="abstraction-period-0"]').contains('From 1 December to 3 September')

    // choose the change option for the abstraction period
    cy.get('[data-test="change-abstraction-period-0"]').click()

    // change the abstraction period and continue
    cy.get('#abstractionPeriodStartDay').clear()
    cy.get('#abstractionPeriodStartMonth').clear()
    cy.get('#abstractionPeriodEndDay').clear()
    cy.get('#abstractionPeriodEndMonth').clear()

    cy.get('#abstractionPeriodStartDay').type('02')
    cy.get('#abstractionPeriodStartMonth').type('10')
    cy.get('#abstractionPeriodEndDay').type('05')
    cy.get('#abstractionPeriodEndMonth').type('12')
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the abstraction period changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="abstraction-period-0"]').contains('From 2 October to 5 December')

    // confirm we see the returns cycle selected
    cy.get('[data-test="returns-cycle-0"]').contains('Summer')

    // choose the change option for the returns cycle
    cy.get('[data-test="change-returns-cycle-0"]').click()

    // change the returns cycle and continue
    cy.get('#winterAndAllYear').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the returns cycle changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="returns-cycle-0"]').contains('Winter')

    // confirm we see the site description we selected
    cy.get('[data-test="site-description-0"]').contains('This is a valid site description')

    // choose the change option for the site description
    cy.get('[data-test="change-site-description-0"]').click()

    // change the site description and continue
    cy.get('#siteDescription').clear()
    cy.get('#siteDescription').type('This is another valid site description')
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the site description changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="site-description-0"]').contains('This is another valid site description')

    // confirm we see the collection frequency we selected
    cy.get('[data-test="frequency-collected-0"]').contains('Daily')

    // choose the change option for the collection frequency
    cy.get('[data-test="change-frequency-collected-0"]').click()

    // change the collection frequency and continue
    cy.get('#frequencyCollectedWeek').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the collection frequency changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="frequency-collected-0"]').contains('Weekly')

    // confirm we see the reporting frequency we selected
    cy.get('[data-test="frequency-reported-0"]').contains('Daily')

    // choose the change option for the reporting frequency
    cy.get('[data-test="change-frequency-reported-0"]').click()

    // change the reporting frequency and continue
    cy.get('#frequencyReportedMonth').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the reporting frequency changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="frequency-reported-0"]').contains('Monthly')

    // confirm we see the agreements and exceptions we selected
    cy.get('[data-test="agreements-exceptions-0"]').contains('Gravity fill')

    // choose the change option for agreements exceptions
    cy.get('[data-test="change-agreements-exceptions-0"]').click()

    // change the agreements exceptions and continue
    cy.get('#gravityFill').uncheck()
    cy.get('#transferReAbstractionScheme').check()
    cy.get('#twoPartTariff').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page and see the agreements exceptions changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="agreements-exceptions-0"]').contains('Transfer re-abstraction scheme and Two-part tariff')

    // click the add another requirement button
    cy.contains('Add another requirement').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-l').contains('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    cy.get('[data-test="purpose-0"]').check()
    cy.contains('Continue').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-l').contains('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    cy.get('#points').check()
    cy.contains('Continue').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-l').contains('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    cy.get('#abstractionPeriodStartDay').type('07')
    cy.get('#abstractionPeriodStartMonth').type('07')
    cy.get('#abstractionPeriodEndDay').type('08')
    cy.get('#abstractionPeriodEndMonth').type('12')
    cy.contains('Continue').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-l').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#summer').check()
    cy.contains('Continue').click()

    // confirm we are on the site description page
    cy.get('h1').should('have.text', 'Enter a site description for the requirements for returns')

    // enter a site description and continue
    cy.get('#siteDescription').type('This is a valid site description for the second requirement')
    cy.contains('Continue').click()

    // confirm we are on the readings collected page
    cy.get('.govuk-heading-l').contains('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    cy.get('#frequencyCollectedMonth').check()
    cy.contains('Continue').click()

    // confirm we are on the readings reported page
    cy.get('.govuk-heading-l').contains('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    cy.get('#frequencyReportedDay').check()
    cy.contains('Continue').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose a agreement and exception and continue
    cy.get('#gravityFill').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the new requirement
    cy.get('[data-test="requirement-1"]').contains('This is a valid site description for the second requirement')

    // choose the remove requirement button for the second requirement
    cy.get('[data-test="remove-1"]').click()

    // confirm we are on the remove page
    cy.get('.govuk-heading-l').contains('You are about to remove these requirements for returns')

    // confirm we see the correct requirement to be removed
    cy.get('p').contains('Summer daily requirements for returns, This is a valid site description for the second requirement.')

    // choose the remove button
    cy.contains('Remove').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we receive a notification pop up confirming the removed requirement
    cy.get('.govuk-notification-banner').contains('Requirement removed')

    // confirm the second requirement has been removed
    cy.get('[data-test="requirement-1"]').should('not.exist')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('h1').should('contain.text', 'Licence set up')

    // Confirm we can display the return version details
    cy.get('[data-test="return-version-0').click()

    cy.get('.govuk-heading-l').contains('Requirements for returns for Mr J J Testerson')

    cy.get('[data-test="start-date"]').contains('2 August 2023')
    cy.get('[data-test="reason"]').contains('Minor change')

    // Return requirement 1
    cy.get('#requirement-0 > div.govuk-summary-card__title-wrapper > h2').contains('This is another valid site description')
    cy.get('[data-test="purposes-0"]').contains('Make-Up Or Top Up Water (This is another purpose description)')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TT 9876 5432 (Example point 2)')
    cy.get('[data-test="abstraction-period-0"]').contains('2 October to 5 December')
    cy.get('[data-test="returns-cycle-0"]').contains('Winter and all year')
    cy.get('[data-test="site-description-0"]').contains('This is another valid site description')
    cy.get('[data-test="frequency-collected-0"]').contains('Weekly')
    cy.get('[data-test="frequency-reported-0"]').contains('Monthly')
    cy.get('[data-test="agreements-exceptions-0"]').contains('Transfer re-abstraction scheme and Two-part tariff')
  })
})
