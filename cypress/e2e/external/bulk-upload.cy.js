'use strict'

describe.skip('Bulk upload returns (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('bulk-return')
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('can log in and out as an external user', () => {
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

    //  Assert the user signed in
    cy.contains('Add licences or give access')

    // Check the licence we'll be providing a return for is visible
    cy.contains('AT/CURR/MONTHLY/02').should('be.visible')

    cy.get(':nth-child(4) > h2.licence-result__column > a').contains('AT/CURR/MONTHLY/02').click()
    cy.get('#navbar-returns').click()

    // TODO: At this point it breaks. This element is nowhere to be seen in the page. Our problem is the rest of the
    // code does not relate to anything we see in the external UI. So, at this point we've no idea what this test was
    // supposed to be doing.
    //
    // On top of that, use of the community plugin 'cypress-file-upload' is no longer needed or recommended. Cypress
    // now comes with inbuilt support for uploading files. And the addEventListener has the 'smell' of a workaround for
    // some now unknown issue.
    //
    // So, should we ever get to the bottom of what this test should be doing it would need to be re-written anyway.
    cy.get('p > a').click()
    // cy.window().document().then(function (doc) {
    //   doc.addEventListener('click', () => {
    //     setTimeout(function () { doc.location.reload() }, 5000)
    //   })
    //   cy.get('.govuk-list > :nth-child(1) > a').click()
    // })
    // cy.get('.govuk-grid-column-two-thirds > .govuk-button').click()

    // const filepath = 'downloads/big farm co ltd monthly return.csv'
    // cy.get('input[type="file"]').attachFile(filepath)
    // cy.get('button.govuk-button').click()
    // cy.contains('Uploading returns data')
    // cy.contains('Your data is ready to send', { timeout: 100000 })
    // // submit the bulk return
    // cy.get('form > .govuk-button').contains('Submit').click()
    // cy.contains('Returns submitted', { timeout: 200000 }).should('be.visible')
  })
})
