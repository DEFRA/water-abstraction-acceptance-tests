'use strict'

describe('Submit and cancel no returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('returns-requirements.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')
  })

  it('creates a no returns requirement and approves the requirement', () => {
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
    cy.get('[data-test="meta-data-returns-required"]').click()

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.get('.govuk-button').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Select the reason for the requirements for returns')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.get('.govuk-button').click()

    // confirm we are on the set up page
    cy.get('.govuk-fieldset__heading').contains('How do you want to set up the requirements for returns?')

    // click set up manually and continue
    cy.get('#setup-3').check()
    cy.get('.govuk-button').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    cy.get('#purposes').check()
    cy.get('.govuk-button').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    cy.get('#points').check()
    cy.get('.govuk-button').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-xl').contains('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    cy.get('#abstraction-period-start-day').type('01')
    cy.get('#abstraction-period-start-month').type('12')
    cy.get('#abstraction-period-end-day').type('03')
    cy.get('#abstraction-period-end-month').type('09')
    cy.get('.govuk-button').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-xl').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#returnsCycle').check()
    cy.get('.govuk-button').click()

    // confirm we are on the site description page
    cy.get('.govuk-label').contains('Enter a site description for the requirements for returns')

    // enter a site description and continue
    cy.get('#site-description').type('This is a valid site description')
    cy.get('.govuk-button').click()

    // confirm we are on the readings collected page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    cy.get('#frequencyCollected').check()
    cy.get('.govuk-button').click()

    // confirm we are on the readings reported page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    cy.get('#frequencyReported').check()
    cy.get('.govuk-button').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose a agreement and exception and continue
    cy.get('#agreementsExceptions').check()
    cy.get('.govuk-button').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')

    // confirm we see the start date information we expect
    cy.get('#main-content > :nth-child(2)').contains('1 April 2022')

    // choose the change option for the start date
    cy.get('[data-test="meta-data-change-start-date"]').click()

    // change start date and continue
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('02')
    cy.get('#other-start-date-month').type('08')
    cy.get('#other-start-date-year').type('2023')
    cy.get('.govuk-button').click()

    // confirm we are back on check page and see the start date changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('[data-test="meta-data-start-date"]').contains('2 August 2023')

    // confirm we see the reason we selected
    cy.get('[data-test="meta-data-reason"]').contains('Licence holder name or address change')

    // choose the change option for reason
    cy.get('[data-test="meta-data-change-reason"]').click()

    // change the reason and continue
    cy.get('#reason-8').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the reason changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('[data-test="meta-data-reason"]').contains('New licence')

    // confirm we see the purposes selected
    cy.get('.govuk-summary-card__content').contains('requirement.purposes')

    // choose the change option for purposes
    cy.get('[data-test="meta-data-change-purpose"]').click()

    // change the purpose and continue
    cy.get('#purposes').uncheck()
    cy.get('#purposes-2').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the purpose changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('.govuk-summary-card__content').contains('requirement.purposes')

    // confirm we see the points selected
    cy.get('.govuk-summary-card__content').contains('requirement.points')

    // choose the change option for points
    cy.get('[data-test="meta-data-change-points"]').click()

    // change the points and continue
    cy.get('#points').uncheck()
    cy.get('#points-2').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the points changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('.govuk-summary-card__content').contains('requirement.points')

    // confirm we see the abstraction period selected
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('From 1 December to 3 September')

    // choose the change option for the abstraction period
    cy.get('[data-test="meta-data-change-abstraction-period"]').click()

    // change the abstraction period and continue
    cy.get('#abstraction-period-start-day').clear()
    cy.get('#abstraction-period-start-month').clear()
    cy.get('#abstraction-period-end-day').clear()
    cy.get('#abstraction-period-end-month').clear()

    cy.get('#abstraction-period-start-day').type('02')
    cy.get('#abstraction-period-start-month').type('10')
    cy.get('#abstraction-period-end-day').type('05')
    cy.get('#abstraction-period-end-month').type('12')
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the abstraction period changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('From 2 October to 5 December')

    // confirm we see the returns cycle selected
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('requirement.returnsCycle')

    // choose the change option for the returns cycle
    cy.get('[data-test="meta-data-change-returns-cycle"]').click()

    // change the returns cycle and continue
    cy.get('#returnsCycle-2').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the returns cycle changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('requirement.returnsCycle')

    // confirm we see the site description we selected
    cy.get(':nth-child(5) > .govuk-summary-list__value').contains('This is a valid site description')

    // choose the change option for the site description
    cy.get('[data-test="meta-data-change-site-description"]').click()

    // change the site description and continue
    cy.get('#site-description').clear()
    cy.get('#site-description').type('This is another valid site description')
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the site description changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(5) > .govuk-summary-list__value').contains('This is another valid site description')

    // confirm we see the collection frequency we selected
    cy.get(':nth-child(6) > .govuk-summary-list__value').contains('Daily')

    // choose the change option for the collection frequency
    cy.get('[data-test="meta-data-change-frequency-collected"]').click()

    // change the collection frequency and continue
    cy.get('#frequencyCollected-2').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the collection frequency changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(6) > .govuk-summary-list__value').contains('Weekly')

    // confirm we see the reporting frequency we selected
    cy.get(':nth-child(7) > .govuk-summary-list__value').contains('Daily')

    // choose the change option for the reporting frequency
    cy.get('[data-test="meta-data-change-frequency-reported"]').click()

    // change the reporting frequency and continue
    cy.get('#frequencyReported-3').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the collection frequency changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(7) > .govuk-summary-list__value').contains('Monthly')

    // confirm we see the agreements and exceptions we selected
    cy.get(':nth-child(8) > .govuk-summary-list__value').contains('requirement.agreementsExceptions')

    // choose the change option for agreements exceptions
    cy.get('[data-test="meta-data-change-agreements-exceptions"]').click()

    // change the agreements exceptions and continue
    cy.get('#agreementsExceptions').uncheck()
    cy.get('#agreementsExceptions-2').check()
    cy.get('#agreementsExceptions-3').check()
    cy.get('.govuk-button').click()

    // confirm we are back on the check page and see the agreements exceptions changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get(':nth-child(8) > .govuk-summary-list__value').contains('requirement.agreementsExceptions')

    // click the add another requirement button
    cy.get('form > .govuk-button').click()

    // confirm we are on the purpose page
    cy.get('.govuk-heading-xl').contains('Select the purpose for the requirements for returns')

    // choose a purpose for the requirement and continue
    cy.get('#purposes').check()
    cy.get('.govuk-button').click()

    // confirm we are on the points page
    cy.get('.govuk-heading-xl').contains('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    cy.get('#points').check()
    cy.get('.govuk-button').click()

    // confirm we are on the abstraction period page
    cy.get('.govuk-heading-xl').contains('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    cy.get('#abstraction-period-start-day').type('07')
    cy.get('#abstraction-period-start-month').type('07')
    cy.get('#abstraction-period-end-day').type('08')
    cy.get('#abstraction-period-end-month').type('12')
    cy.get('.govuk-button').click()

    // confirm we are on the returns cycle page
    cy.get('.govuk-heading-xl').contains('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    cy.get('#returnsCycle').check()
    cy.get('.govuk-button').click()

    // confirm we are on the site description page
    cy.get('.govuk-label').contains('Enter a site description for the requirements for returns')

    // enter a site description and continue
    cy.get('#site-description').type('This is a valid site description for the second requirement')
    cy.get('.govuk-button').click()

    // confirm we are on the readings collected page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    cy.get('#frequencyCollected-3').check()
    cy.get('.govuk-button').click()

    // confirm we are on the readings reported page
    cy.get('.govuk-heading-xl').contains('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    cy.get('#frequencyReported').check()
    cy.get('.govuk-button').click()

    // confirm we are on the agreements and exceptions page
    cy.get('.govuk-heading-l').contains('Select agreements and exceptions for the requirements for returns')

    // choose a agreement and exception and continue
    cy.get('#agreementsExceptions').check()
    cy.get('.govuk-button').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')

    // confirm we see the new requirement
    cy.get(':nth-child(4) > .govuk-summary-card > .govuk-summary-card__title-wrapper').contains('second requirement')
  })
})
