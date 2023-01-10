// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'querystring'

Cypress.Commands.add('setUp', (testKey) => {
  cy.log(`Setting up ${testKey} test data`)

  cy.request({
    url: `/acceptance-tests/set-up-from-yaml/${testKey}`,
    log: false,
    method: 'POST',
    headers: {
      authorization: `Bearer ${Cypress.env('jwtToken')}`
    },
    body: { dummy: 'Because the WAF blocks empty POST requests' }
  }).its('status', { log: false }).should('equal', 204)
})

Cypress.Commands.add('tearDown', () => {
  cy.log('Tearing down existing test data')

  cy.request({
    url: '/acceptance-tests/tear-down',
    log: false,
    method: 'POST',
    headers: {
      authorization: `Bearer ${Cypress.env('jwtToken')}`
    },
    body: { dummy: 'Because the WAF blocks empty POST requests' }
  }).its('status', { log: false }).should('equal', 200)
})

Cypress.Commands.add('lastNotification', (email) => {
  cy.log('Getting last email sent to Notify')

  cy.request({
    url: `/notifications/last?email=${email}`,
    log: false,
    method: 'GET'
  }).then((response) => {
    return cy.wrap(response.body)
  })
})

Cypress.Commands.add('simulateNotifyCallback', (notificationId) => {
  cy.log('Simulating a Notify callback request')

  cy.request({
    url: `${Cypress.env('externalUrl')}/notify/callback`,
    log: false,
    method: 'POST',
    headers: {
      authorization: `Bearer ${Cypress.env('notifyCallbackToken')}`
    },
    body: {
      id: notificationId,
      reference: notificationId,
      status: 'delivered',
      notification_type: 'email',
      to: 'irrelevant',
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      sent_at: new Date().toISOString()
    }
  }).then((response) => {
    return cy.wrap(response)
  })
})
