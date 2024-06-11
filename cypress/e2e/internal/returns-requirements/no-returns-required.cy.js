'use strict'

describe('Submit no returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('returns-requirements.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')
  })

  it('creates a no return requirement and approves the requirement', () => {
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

    // click set up no returns requirement
    cy.contains('No returns required').click()

    // confirm we are on the start date page
    cy.get('.govuk-fieldset__heading').contains('Select the start date for the requirements for returns')

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-fieldset__heading').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see text about no returns required
    cy.contains('Returns are not required for this licence')

    // confirm we are seeing the details we selected
    cy.get('[data-test="meta-data-start-date"]').should('contain.text', '1 January 2022')
    cy.get('[data-test="meta-data-reason"]').should('contain.text', 'Returns exception')

    // click the change link for the start date
    cy.get('[data-test="meta-data-change-start-date"]').click()

    // change start date and continue
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('02')
    cy.get('#other-start-date-month').type('08')
    cy.get('#other-start-date-year').type('2023')
    cy.contains('Continue').click()

    // confirm we are back on check page and see the start date changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('[data-test="meta-data-start-date"]').contains('2 August 2023')

    // click the change link for the reason
    cy.get('[data-test="meta-data-change-reason"]').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-fieldset__heading').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-3').check()
    cy.contains('Continue').click()

    // confirm we are back on check page and see the reason changes
    cy.get('.govuk-heading-xl').contains('Check the return requirements for Mr J J Testerson')
    cy.get('[data-test="meta-data-reason"]').contains('Transfer licence')

    // confirm we see the option to add note
    cy.get('.govuk-heading-l').contains('Notes')

    // confirm no notes have been added
    cy.contains('No notes added').should('exist')

    // click add a note
    cy.contains('Add a note').click()

    // confirm we are on note page
    cy.get('.govuk-heading-l').contains('Add a note')

    // type a note and click the confirm button
    cy.get('#note').type('This is a note for a no returns requirement.')
    cy.contains('Confirm').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see pop up notification confirming changes have been made
    cy.get('.govuk-notification-banner').contains('Changes made')

    // confirm we see the node added
    cy.contains('This is a note for a no returns requirement.').should('exist')

    // CHANGE THISSSSS!!!!
    // click the change note link
    cy.get(':nth-child(1) > .govuk-link').click()

    // make changes to the note and confirm
    cy.get('#note').clear()
    cy.get('#note').type('This is new and improved note for a no return requirement.')
    cy.contains('Confirm').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see pop up notification confirming changes have been made
    cy.get('.govuk-notification-banner').contains('Changes made')

    // confirm we see the node added
    cy.contains('This is new and improved note for a no return requirement.').should('exist')

    // click the delete note link
    cy.contains('Delete').click()

    // confirm we see pop notification confirming deleted note
    cy.get('.govuk-notification-banner').contains('Note removed')

    // confirm no notes have been added
    cy.contains('No notes added').should('exist')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the charge information tab
    cy.get('#charge').contains('Charge information')
  })
})
