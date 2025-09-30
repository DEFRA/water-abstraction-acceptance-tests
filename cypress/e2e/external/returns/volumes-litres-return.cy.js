'use strict'

import scenarioData from '../../../support/scenarios/external-return-submission.js'

const scenario = scenarioData()

describe('Submit volumes in litres return (external)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('userEmail')
  })

  it('login as an existing user and submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/licences`)

    // Select a licence to submit returns for
    cy.contains('AT/CURR/DAILY/01').click()
    cy.get('#tab_returns').click()
    cy.get('#returns').should('be.visible')

    // Start the return journey - return reference 9999990
    cy.get('#returns > .govuk-table > .govuk-table__body > .govuk-table__row > [scope="row"] > a').click()

    // --> Have you extracted water in this period?
    // Click 'Yes' and continue
    cy.get('input[value="false"]').check()
    cy.get('form>.govuk-button').click()

    // --> How are you reporting your figures?
    // Click 'Volumes from one or more meters' and continue
    cy.get('input[value="abstractionVolumes,measured"]').check()
    cy.get('form>.govuk-button').click()

    // --> Which units are you using?
    // Click 'Litres' and continue
    cy.get('input[value="l"]').check()
    cy.get('form>.govuk-button').click()

    // --> Your abstraction volumes
    // Check validation - enter negative numbers
    cy.get('input[name="2020-04-01_2020-04-30"]').type('-1000')
    cy.get('input[name="2020-05-01_2020-05-31"]').type('-1000')
    cy.get('input[name="2020-06-01_2020-06-30"]').type('-1000')
    cy.get('input[name="2020-07-01_2020-07-31"]').type('-1000')
    cy.get('input[name="2020-08-01_2020-08-31"]').type('-1000')
    cy.get('input[name="2020-09-01_2020-09-30"]').type('-1000')
    cy.get('input[name="2020-10-01_2020-10-31"]').type('-1000')
    cy.get('input[name="2020-11-01_2020-11-30"]').type('-1000')
    cy.get('input[name="2020-12-01_2020-12-31"]').type('-1000')
    cy.get('input[name="2021-01-01_2021-01-31"]').type('-1000')
    cy.get('input[name="2021-02-01_2021-02-28"]').type('-1000')
    cy.get('input[name="2021-03-01_2021-03-31"]').type('-1000')
    cy.get('form>.govuk-button').click()
    cy.get('#error-summary-title').should('contain.text', 'There is a problem')
    cy.get('.govuk-error-summary__list').children().should('have.length', '12')
    cy.get('.govuk-error-summary__list').children(0).should('contain.text', 'Enter an amount of 0 or above')
    // Enter valid volumes and continue
    cy.get('input[name="2020-04-01_2020-04-30"]').clear().type('1000')
    cy.get('input[name="2020-05-01_2020-05-31"]').clear().type('1000')
    cy.get('input[name="2020-06-01_2020-06-30"]').clear().type('1000')
    cy.get('input[name="2020-07-01_2020-07-31"]').clear().type('1000')
    cy.get('input[name="2020-08-01_2020-08-31"]').clear().type('1000')
    cy.get('input[name="2020-09-01_2020-09-30"]').clear().type('1000')
    cy.get('input[name="2020-10-01_2020-10-31"]').clear().type('1000')
    cy.get('input[name="2020-11-01_2020-11-30"]').clear().type('1000')
    cy.get('input[name="2020-12-01_2020-12-31"]').clear().type('1000')
    cy.get('input[name="2021-01-01_2021-01-31"]').clear().type('1000')
    cy.get('input[name="2021-02-01_2021-02-28"]').clear().type('1000')
    cy.get('input[name="2021-03-01_2021-03-31"]').clear().type('1000')
    cy.get('form>.govuk-button').click()

    // --> Your current meter details
    cy.get('input[name="manufacturer"]').type('Test Water Meter')
    cy.get('input[name="serialNumber"]').type('Test serial number')
    cy.get('#isMultiplier').check()
    cy.get('form>.govuk-button').click()

    // Confirm and submit the details
    cy.get('h2.govuk-heading-l').should('contain.text', 'Confirm your return')
    // Check the calculated total
    cy.get(':nth-child(3) > strong').should('contain.text', '12')
    cy.get('form>.govuk-button').click()

    // Confirm Return submitted
    cy.get('.panel__title').should('contain.text', 'Return submitted')
  })
})
