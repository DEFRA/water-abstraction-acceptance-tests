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
    timeout: 60000
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
    timeout: 60000
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

Cypress.Commands.add('extractNotificationLink', (body, linkType, url) => {
  cy.log(`Extracting ${linkType} link from Notify email`)

  let link = body.data[0].personalisation[linkType]
  link = link.replace((/^https?:\/\/[^/]+\//g).exec(link), url + '/')

  return cy.wrap(link)
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

// The output date format of methods such as toLocaleString() are based on the Unicode CLDR which is subject to
// change and cannot be relied on to be consistent: https://github.com/nodejs/node/issues/42030. We therefore
// generate the formatted date ourselves.
Cypress.Commands.add('dayMonthYearFormattedDate', (date) => {
  if (!date) {
    date = new Date()
  }

  const day = date.getDate()

  const monthStrings = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = monthStrings[date.getMonth()]

  const year = date.getFullYear()

  return cy.wrap(`${day} ${month} ${year}`)
})

// Created when we needed to wait until the status of a bill run changed from BUILDING to EMPTY. We have made it generic
// so it can be used in any other similar scenarios.
Cypress.Commands.add('reloadUntilTextFound', (selector, textToMatch, retries = 3, retryWait = 1000) => {
  if (retries === 0) {
    throw new Error(`Exhausted retries looking for ${textToMatch} in ${selector}.`)
  }

  const text = Cypress.$(selector).text()
  if (text.trim().startsWith(textToMatch)) {
    return
  }

  cy.wait(retryWait)
  cy.reload()
  cy.reloadUntilTextFound(selector, textToMatch, retries - 1, retryWait)
})
