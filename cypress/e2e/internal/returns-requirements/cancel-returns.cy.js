'use strict'

describe('Cancel a return requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('returns-requirements.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('cancels a return requirement after completing the journey', () => {
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
    cy.get('#query').type('AT/TEST/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page and select licence set up tab
    cy.contains('AT/TEST/01')
    cy.contains('Licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up new requirements
    cy.contains('Set up new requirements').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // click set up manually and continue
    cy.get('#setup-4').check()
    cy.contains('Continue').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    cy.get('[data-test="purpose-0"]').check()
    cy.contains('Continue').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    cy.get('#points').check()
    cy.contains('Continue').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-xl').contains('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    cy.get('#abstraction-period-start-day').type('01')
    cy.get('#abstraction-period-start-month').type('12')
    cy.get('#abstraction-period-end-day').type('03')
    cy.get('#abstraction-period-end-month').type('09')
    cy.contains('Continue').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-xl').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#returnsCycle').check()
    cy.contains('Continue').click()

    // confirm we are on the site description page
    cy.get('.govuk-label').contains('Enter a site description for the requirements for returns')

    // enter a site description and continue
    cy.get('#site-description').type('This is a valid site description')
    cy.contains('Continue').click()

    // confirm we are on the readings collected page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    cy.get('#frequencyCollected').check()
    cy.contains('Continue').click()

    // confirm we are on the readings reported page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    cy.get('#frequencyReported').check()
    cy.contains('Continue').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose an agreement and exception and continue
    cy.get('#agreementsExceptions').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the start date information we expect
    cy.get('[data-test="start-date"]').contains('12 June 2023')

    // confirm we see the reason we selected
    cy.get('[data-test="reason"]').contains('Change to special agreement')

    // confirm we see the purposes selected
    cy.get('[data-test="purposes-0"]').should('contain', 'Hydroelectric Power Generation')

    // confirm we see the points selected
    cy.get('[data-test="points-0"]').should('contain', 'At National Grid Reference TQ 1234 5678 (Example licence point 1)')

    // confirm we see the abstraction period selected
    cy.get('[data-test="abstraction-period-0"]').contains('From 1 December to 3 September')

    // confirm we see the returns cycle selected
    cy.get('[data-test="returns-cycle-0"]').contains('Summer')

    // confirm we see the site description we selected
    cy.get('[data-test="site-description-0"]').contains('This is a valid site description')

    // confirm we see the collection frequency we selected
    cy.get('[data-test="frequency-collected-0"]').contains('Daily')

    // confirm we see the reporting frequency we selected
    cy.get('[data-test="frequency-reported-0"]').contains('Daily')

    // confirm we see the agreements and exceptions we selected
    cy.get('[data-test="agreements-exceptions-0"]').contains('Gravity fill')

    // choose the cancel return requirement button
    cy.contains('Cancel return requirement').click()

    // confirm we are on the cancel page
    cy.contains('You are about to cancel these requirements for returns')

    // confirm we see the requirements we are going to cancel
    cy.contains('Summer daily requirements for returns, This is a valid site description.')

    // click the confirm cancel button
    cy.contains('Confirm cancel').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')
  })
})
