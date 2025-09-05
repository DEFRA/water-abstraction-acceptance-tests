'use strict'

import { basicLicenceOneReturnRequirement } from '../../../support/fixture-builder/scenarios.js'

const dataModel = basicLicenceOneReturnRequirement()

describe('Submit no returns requirement (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    // Get the user email and login as the user
    cy.fixture('users.json').its('billingAndData').as('userEmail')
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    cy.load(dataModel)
  })

  it('creates a no return requirement and approves the requirement', () => {
    cy.visit(`/system/licences/${dataModel.licences[0].id}/set-up`)

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // click set up no returns requirement
    cy.contains("Mark licence as 'no returns needed'").click()

    // confirm we are on the start date page
    cy.get('.govuk-heading-l').contains('Select the start date for the requirements for returns')

    // choose the licence version start date and click continue
    cy.get('#licence-start-date').check()
    cy.contains('Continue').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-heading-l').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-2').check()
    cy.contains('Continue').click()

    // confirm we are on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see text about no returns required
    cy.contains('Returns are not required for this licence')

    // confirm we are seeing the details we selected
    cy.get('[data-test="start-date"]').should('contain.text', '1 January 2020')
    cy.get('[data-test="reason"]').should('contain.text', 'Licence conditions do not require returns')

    // click the change link for the reason
    cy.get('[data-test="change-reason"]').click()

    // confirm we are on the why no returns required page
    cy.get('.govuk-heading-l').contains('Why are no returns required?')

    // choose returns exception and click continue
    cy.get('#reason-3').check()
    cy.contains('Continue').click()

    // confirm we are back on check page and see the reason changes
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')
    cy.get('[data-test="reason"]').contains('Returns exception')

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
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see pop up notification confirming changes have been made
    cy.get('.govuk-notification-banner').contains('Note added')

    // confirm we see the note added
    cy.contains('This is a note for a no returns requirement.').should('exist')

    // click the change note link
    cy.get('[data-test="note"]').click()

    // make changes to the note and confirm
    cy.get('#note').clear()
    cy.get('#note').type('This is new and improved note for a no return requirement.')
    cy.contains('Confirm').click()

    // confirm we are back on the check page
    cy.get('.govuk-heading-l').contains('Check the requirements for returns for Mr J J Testerson')

    // confirm we see pop up notification confirming changes have been made
    cy.get('.govuk-notification-banner').contains('Note updated')

    // confirm we see the note added
    cy.contains('This is new and improved note for a no return requirement.').should('exist')

    // click the delete note link
    cy.contains('Delete').click()

    // confirm we see pop notification confirming deleted note
    cy.get('.govuk-notification-banner').contains('Note deleted')

    // confirm no notes have been added
    cy.contains('No notes added').should('exist')

    // choose the approve return requirement button
    cy.contains('Approve returns requirement').click()

    // confirm we are on the approved page
    cy.get('.govuk-panel__title').contains('Requirements for returns approved')

    // click link to return to licence set up
    cy.contains('Return to licence set up').click()

    // confirm we are on the licence set up tab
    cy.get('#set-up > .govuk-heading-l').contains('Licence set up')

    // Confirm we can display the return version details
    cy.get('[data-test="return-version-0').click()

    cy.get('.govuk-heading-l').contains('Requirements for returns for Mr J J Testerson')

    cy.get('[data-test="start-date"]').contains('1 January 2020')
    cy.get('[data-test="reason"]').contains('Returns exception')
    cy.get('h3').contains('Returns are not required for this licence')
  })
})
