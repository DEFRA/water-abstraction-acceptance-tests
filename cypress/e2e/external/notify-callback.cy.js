'use strict'

describe('Notify callback endpoint', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('notify-mock-notification.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData1').as('userEmail')
  })

  it('when called by Notify sets the status of the notification to delivered', () => {
    // Pretending to be the Notify Service, submit a callback to the service, which updates the status of the
    // Notification record added in the fixture to 'delivered'
    cy.simulateNotifyCallback('82fda2b8-0a53-4f02-bcaa-1e13949b250b')
      .its('status', { log: false }).should('equal', 204)

    cy.get('@userEmail').then((userEmail) => {
      cy.lastNotification(userEmail).its('data[0].notify_status').should('equal', 'delivered')
    })
  })
})
