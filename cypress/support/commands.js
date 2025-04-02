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

Cypress.Commands.add('load', (body) => {
  cy.log('Loading test data')

  cy.request({
    url: '/system/data/load',
    log: false,
    method: 'POST',
    body,
    timeout: 60000
  }).then((response) => {
    return cy.wrap(response.body)
  })
})

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
    url: '/system/data/tear-down',
    log: false,
    method: 'POST',
    timeout: 60000
  }).its('status', { log: false }).should('equal', 204)
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
Cypress.Commands.add('reloadUntilTextFound', (selector, textToMatch, retries = 10, retryWait = 2000) => {
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

// We do not control when the tests are run so sometimes we need a date that is within the current financial year when
// they are. For example, when testing billing scenarios we often only want to make charge information changes within
// the current year to avoid additional calculations for previous years.
//
// It defaults to the last possible date. If the current date was 2023-06-05 it would return 2024-03-31. You can
// override the day and month (don't worry about month being zero-indexed - it gets dealt with!) and adjust the year
// by plus or minus as many years as you need.
Cypress.Commands.add('currentFinancialYearDate', (day = 31, month = 3, yearAdjuster = 0) => {
  // IMPORTANT! getMonth returns an integer (0-11). So, January is represented as 0 and December as 11. This is why
  // MARCH is 2 rather than 3
  const MARCH = 2

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  let endYear

  if (currentDate.getMonth() <= MARCH) {
    // For example, if currentDate was 2022-02-15 it would fall in financial year 2021-04-01 to 2022-03-31
    endYear = currentYear + yearAdjuster
  } else {
    // For example, if currentDate was 2022-06-15 it would fall in financial year 2022-04-01 to 2023-03-31
    endYear = (currentYear + 1) + yearAdjuster
  }

  // we provide the result as this so callers of this function can choose to use the date value or access the
  // individual elements for use in input fields
  const result = {
    date: new Date(Date.UTC(endYear, month - 1, day)),
    day,
    month,
    year: endYear
  }

  // We generate the date value using Date.UTC() to avoid 31 March becoming 30 March 23:00 because of pesky BST
  return cy.wrap(result)
})

// Both the PRE-SROC and SROC schemes support calculating bill runs up to 5 years back. So, when you make a change
// to a licence's charge versions the supplementary billing engine is expected to calculate the charges for each
// year (what we refer to as a billing period). The tests need to be able to determine this in order to work out
// how many bills will appear in a supplementary bill run.
//
// However, 2022-04-01 was the date PRE-SROC was replaced by SROC. So, when we calculate how many billing periods a
// bill run will be generating bills for, we know it will be for the number of years from 2023 to whatever
// financialYearToBaseItOn is. For example
//
// - financialYearToBaseItOn is 2024 (2023-04-01 to 2024-03-31) so result will be 2 SROC and 3 PRESROC
// - financialYearToBaseItOn is 2025 (2024-04-01 to 2025-03-31) so result will be 3 SROC and 2 PRESROC
// - financialYearToBaseItOn is 2026 (2025-04-01 to 2026-03-31) so result will be 4 SROC and 1 PRESROC
// - financialYearToBaseItOn is 2027 (2026-04-01 to 2027-03-31) so result will be 5 SROC and 0 PRESROC
// - financialYearToBaseItOn is 2028 (2027-04-01 to 2028-03-31) so result will be 5 SROC and 0 PRESROC
Cypress.Commands.add('billingPeriodCounts', (financialYearToBaseItOn) => {
  if (isNaN(financialYearToBaseItOn)) {
    throw new Error('billingPeriodCounts: financialYearToBaseItOn must be set and a number')
  }

  const earliestPossibleFinancialYear = Math.max(2023, financialYearToBaseItOn - 5)
  const srocBillingPeriods = Math.min((financialYearToBaseItOn - earliestPossibleFinancialYear) + 1, 5)
  const presrocBillingPeriods = 6 - srocBillingPeriods

  return cy.wrap({ presroc: presrocBillingPeriods, sroc: srocBillingPeriods })
})
