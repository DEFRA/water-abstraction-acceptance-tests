'use strict'

describe('Submit and cancel no returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-current')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
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
    cy.get('#query').type('AT/SROC/SUPB/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // confirm we are on the licence page and select charge information tab
    cy.contains('AT/SROC/SUPB/01')
    cy.get('#tab_charge').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')

    // click the no returns required button
    cy.get('[data-test="meta-data-no-returns"]').click()

    // confirm we are on the start date page
    cy.get('.govuk-fieldset__heading').contains('start date')

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.get('.govuk-button').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-fieldset__heading').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.get('.govuk-button').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see text about no returns required
    cy.get('.govuk-heading-m').contains('Returns are not required for this licence')

    // confirm we are seeing the details we selected
    cy.get('[data-test="meta-data-start-date"]').should('contain.text', '1 January 2022')
    cy.get('[data-test="meta-data-reason"]').should('contain.text', 'Returns exception')

    // confirm we can click the change button for start date
    cy.get(':nth-child(1) > .govuk-summary-list__actions > .govuk-link').click()

    // confirm we are on the start date page
    cy.get('.govuk-fieldset__heading').contains('start date')

    // make changes to the start date and click continue
    cy.get('#another-start-date').check()
    cy.get('#other-start-date-day').type('25')
    cy.get('#other-start-date-month').type('10')
    cy.get('#other-start-date-year').type('2022')
    cy.get('.govuk-button').click()

    // confirm we return to the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see the changes made
    cy.get('[data-test="meta-data-start-date"]').should('contain.text', '25 October 2022')

    // confirm we can click the change button for reason
    cy.get(':nth-child(2) > .govuk-summary-list__actions > .govuk-link').click()

    // confirm we are on the reason page
    cy.get('.govuk-fieldset__heading').contains('Why are no returns required?')

    // make changes to the reason and click continue
    cy.get('#reason-3').check()
    cy.get('.govuk-button').click()

    // confirm we see the changes made
    cy.get('[data-test="meta-data-reason"]').should('contain.text', 'Transfer licence')

    // confirm we see the option to add note
    cy.get('.govuk-heading-l').contains('Notes')

    // confirm no notes have been added
    cy.get('#main-content > :nth-child(3)').contains('No notes added')

    // click add a note
    cy.get(':nth-child(1) > .govuk-link').click()

    // confirm we are on note page
    cy.get('.govuk-heading-l').contains('Add a note')

    // type a note
    cy.get('#note').type('This is a note for a no returns requirement ')

    // click the confirm button
    cy.get('.govuk-button').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-xl').contains('Check the return requirements')

    // confirm we see pop up notification confirming changes have been made
    cy.get('.govuk-notification-banner').contains('Changes made')

    // confirm we see the node added
    cy.get('#main-content > :nth-child(4)').contains('This is a note for a no returns requirement ')

    // click the change note link
    cy.get(':nth-child(1) > .govuk-link').click()

    // make changes to the note and confirm
    cy.get('#note').type(' with added changes.')
    cy.get('.govuk-button').click()

    // confirm changes to the note
    cy.get('#main-content > :nth-child(4)').contains('This is a note for a no returns requirement with added changes.')

    // click the delete note link
    cy.get('.govuk-summary-list__actions-list > :nth-child(2) > .govuk-link').click()

    // confirm we see pop notification confirming deleted note
    cy.get('.govuk-notification-banner').contains('Note removed')

    // confirm no notes are added
    cy.get('#main-content > :nth-child(4)').contains('No notes added')

    // click the approve return requirements button
    cy.get('[data-test="meta-data-approve"]').click({ force: true })

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.get(':nth-child(4) > .govuk-link').click()

    // confirm we are on the charge information tab
    cy.get('#charge > :nth-child(1)').contains('Charge information')
  })
})
