'use strict'

describe('Submit metered readings return (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('external-user.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('loadedExternal').as('userEmail')
  })

  it('login as an existing user and submit returns', () => {
    cy.visit(Cypress.env('externalUrl'))

    // tap the sign in button on the welcome page
    cy.get('a[href*="/signin"]').click()

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Select a licence to submit returns for
    cy.contains('AT/CURR/MONTHLY/02').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')

    // Start the return journey - return reference 9999992
    cy.get(':nth-child(1) > [scope="row"] > a').click()

    // --> Have you extracted water in this period?
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Has any water been abstracted?')
    // Click 'Yes' and continue
    cy.get('input[value="false"]').check()
    cy.get('form>.govuk-button').click()

    // --> How are you reporting your figures?
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Select readings from one meter, or other (abstraction volumes)')
    // Click 'Readings from a single meter' and continue
    cy.get('input[value="oneMeter,measured"]').check()
    cy.get('form>.govuk-button').click()

    // --> Did your meter reset in this abstraction period?
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Has your meter reset or rolled over?')
    // Click 'No' and continue
    cy.get('input[value="false"]').check()
    cy.get('form>.govuk-button').click()

    // --> Which units are you using?
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Select a unit of measurement')
    // Click 'Cubic metres' and continue
    cy.get('[type="radio"]').check('m³')
    cy.get('form>.govuk-button').click()

    // --> Enter your readings exactly as they appear on your meter
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Enter a meter start reading')
    // Check validation - enter negative numbers
    cy.get('input[name="startReading"]').type('-1')
    cy.get('input[name="2021-01-01_2021-01-31"]').type('10')
    cy.get('input[name="2021-02-01_2021-02-28"]').type('20')
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'This number should be positive')
    // Check validation - enter non-incrementing numbers
    cy.get('input[name="startReading"]').clear().type('10')
    cy.get('input[name="2021-01-01_2021-01-31"]').clear().type('0')
    cy.get('input[name="2021-02-01_2021-02-28"]').clear().type('20')
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Each meter reading should be higher than or equal to the last')
    // Enter valid readings and continue
    cy.get('input[name="startReading"]').clear().type('0')
    cy.get('input[name="2021-01-01_2021-01-31"]').clear().type('10')
    cy.get('input[name="2021-02-01_2021-02-28"]').clear().type('20')
    cy.get('form>.govuk-button').click()

    // --> Your current meter details
    // Check validation - enter nothing
    cy.get('form>.govuk-button').click()
    cy.get('.govuk-list > li > a').should('have.text', 'Enter the make of your meter')
    // Enter valid details and continue
    cy.get('input[name="manufacturer"]').type('Test Water Meter')
    cy.get('input[name="serialNumber"]').type('Test serial number')
    cy.get('#isMultiplier').check()
    cy.get('form>.govuk-button').click()

    // Confirm and submit the details
    cy.get('h2.govuk-heading-l').should('contain.text', 'Confirm your return')
    // Check the calculated total
    cy.get(':nth-child(3) > strong').should('contain.text', '200')
    cy.get('form>.govuk-button').click()

    // Confirm Return submitted
    cy.get('.panel__title').should('contain.text', 'Return submitted')
  })
})
