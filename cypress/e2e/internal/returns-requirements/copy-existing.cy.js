'use strict'

describe('Submit returns requirement using copy existing (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('returns-requirements.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')
  })

  it('creates a return requirement by copying existing and approves the requirement', () => {
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

    // confirm we are on the licence page and select charge information tab
    cy.contains('AT/TEST/01')
    cy.get('#tab_charge').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')

    // click set up new returns requirement
    cy.contains('Set up new returns requirement').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose a reason for the return and click continue
    cy.get('#reason-2').check()
    cy.contains('Continue').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // choose copy from existing requirements and continue
    cy.get('#setup-2').check()
    cy.contains('Continue').click()

    // confirm we are on the existing requirements page
    cy.get('.govuk-fieldset__heading').contains('Use previous requirements for returns')

    // choose a previous requirements for returns and continue
    cy.get('#existing').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the start date and reason selected
    cy.get('[data-test="start-date"]').contains('12 June 2023')
    cy.get('[data-test="reason"]').contains('Licence holder name or address change')

    // confirm we see the purpose for the requirement copied from existing
    cy.get('[data-test="purposes-0"]').contains('Hydroelectric Power Generation')

    // choose the change link for the purpose and confirm we are on the purpose page
    cy.get('[data-test="change-purposes-0"]').click()
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose another purpose and continue
    cy.get('#purposes-2').uncheck()
    cy.get('#purposes').check()
    cy.contains('Continue').click()

    // confirm we see the purpose changes on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="purposes-0"]').contains('General Farming & Domestic')

    // confirm we see the points for the requirement copied from existing
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TQ 1234 1234 (Test local name 1)')

    // choose the change link for the points and confirm we are on the points page
    cy.get('[data-test="change-points-0"]').click()
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose another points and continue
    cy.get('#points').uncheck()
    cy.get('#points-2').check()
    cy.contains('Continue').click()

    // confirm we see the points changes on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="points-0"]').contains('At National Grid Reference TT 5678 5678 (Test local name 2)')

    // choose add another requirement
    cy.contains('Add another requirement').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose and continue
    cy.get('#purposes-2').check()
    cy.contains('Continue').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose a points and continue
    cy.get('#points-2').check()
    cy.contains('Continue').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-xl').contains('Enter the abstraction period for the requirements for returns')

    // choose a start and end date then continue
    cy.get('#abstraction-period-start-day').type('01')
    cy.get('#abstraction-period-start-month').type('12')
    cy.get('#abstraction-period-end-day').type('03')
    cy.get('#abstraction-period-end-month').type('11')
    cy.contains('Continue').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-xl').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#returnsCycle').check()
    cy.contains('Continue').click()

    // confirm we are on the site description page
    cy.get('.govuk-label').contains('Enter a site description for the requirements for returns')

    // input a site description and continue
    cy.get('#site-description').type('Site description for another return requirement')
    cy.contains('Continue').click()

    // confirm we are on the frequency collected page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are collected')

    // choose a frequency for collection and continue
    cy.get('#frequencyCollected-2').check()
    cy.contains('Continue').click()

    // confirm we are on the frequency reported page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are reported')

    // choose a frequency for reporting and continue
    cy.get('#frequencyReported-2').check()
    cy.contains('Continue').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose some agreements and exceptions and continue
    cy.get('#agreementsExceptions-2').check()
    cy.get('#agreementsExceptions-3').check()
    cy.contains('Continue').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see the new added requirement and details selected
    cy.get('[data-test="purposes-1"]').contains('Hydroelectric Power Generation')
    cy.get('[data-test="points-1"]').contains('At National Grid Reference TT 5678 5678 (Test local name 2)')
    cy.get('[data-test="abstraction-period-1"]').contains('From 1 December to 3 November')
    cy.get('[data-test="returns-cycle-1"]').contains('Summer')
    cy.get('[data-test="site-description-1"]').contains('Site description for another return requirement')
    cy.get('[data-test="frequency-collected-1"]').contains('Weekly')
    cy.get('[data-test="frequency-reported-1"]').contains('Weekly')
    cy.get('[data-test="agreements-exceptions-1"]').contains('Transfer re-abstraction scheme and Two-part tariff')

    // choose the approve returns requirements button
    cy.contains('Approve returns requirements').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the charge information tab
    cy.get('#charge').contains('Charge information')
  })
})
