'use strict'

describe('Submit returns requirement (internal) using abstraction data', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('generate-using-abstraction-data.json').then(cy.load)
    cy.fixture('users.json').its('billingAndData1').as('userEmail')
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

    // choose the start by using abstraction data checkbox and continue
    cy.get('#setup').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the start data and reason options selected previously
    cy.get('[data-test="start-date"]').contains('1 April 2022')
    cy.get('[data-test="reason"]').contains('Change to special agreement')

    // choose the change purpose button for the requirement
    cy.get('[data-test="change-purposes-0"]').click()

    // choose another purpose and continue
    cy.get('[data-test="purpose-0"]').uncheck()
    cy.get('[data-test="purpose-1"]').check()
    cy.contains('Continue').click()

    // confirm we see the changed purpose for the requirement
    cy.get('[data-test="purposes-0"]').contains('Laundry Use')

    // choose the change points button for the requirement
    cy.get('[data-test="change-points-0"]').click()

    // choose another point and continue
    cy.get('#points').uncheck()
    cy.get('#points-2').check()
    cy.contains('Continue').click()

    // confirm we see the changed points for the requirement
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TT 9876 5432 (AT/TEST/01 Requirement')

    // choose the add another requirement
    cy.contains('Add another requirement').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose and click continue
    cy.get('[data-test="purpose-0"]').check()
    cy.get('[data-test="purpose-1"]').check()
    cy.contains('Continue').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose a point and click continue
    cy.get('#points').check()
    cy.contains('Continue').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-xl').contains('Enter the abstraction period for the requirements for returns')

    // choose start and end dates for the abstraction period and click continue
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

    // confirm we see the newly created return requirement
    cy.contains('This is a valid site description')

    // confirm we see the information entered for the return requirement
    cy.get('[data-test="purposes-2"]').contains('General Farming & Domestic Laundry Use')
    cy.get('[data-test="points-2"]').contains('At National Grid Reference TQ 1234 5678 (AT/TEST/01 Requirement')
    cy.get('[data-test="abstraction-period-2"]').contains('From 1 December to 3 September')
    cy.get('[data-test="returns-cycle-2"]').contains('Summer')
    cy.get('[data-test="site-description-2"]').contains('This is a valid site description')
    cy.get('[data-test="frequency-collected-2"]').contains('Daily')
    cy.get('[data-test="frequency-reported-2"]').contains('Daily')
    cy.get('[data-test="agreements-exceptions-2"]').contains('Gravity fill')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')
  })
})
