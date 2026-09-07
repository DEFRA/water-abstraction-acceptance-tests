import { faker } from '@faker-js/faker'
import { generateRandomInteger } from 'water-abstraction-engine/test/generators.js'

import { regionCode } from '../default-values.js'

/**
 * Generates an account number
 *
 * The account number is in the format 'S########A'. The leading 'S' matches the charge region id of our seeded
 * Test Region (region 9), which the app relies on to recognise a billing account as belonging to that region -
 * the engine's own `generateAccountNumber()` always uses 'T', which doesn't match.
 *
 * @returns {string} - An account number
 */
export function generateAccountNumber() {
  return `S${generateRandomInteger(10000000, 99999999)}A`
}

/**
 * Generates a Bill run number
 *
 * @returns {number} - A bill run number
 */
export function generateBillRunNumber() {
  return Number(`${regionCode}${generateRandomInteger(10000, 99999)}`)
}

/**
 * Generates a Point external id
 *
 * @returns {string} - A point external id
 */
export function generatePointExternalId() {
  return `${regionCode}:${regionCode}${generateRandomInteger(100000, 999999)}`
}

/**
 * Generate a unique GOV UK email address (internal)
 *
 * We use 'acceptance.test.' to delete all relevant test email address.
 *
 * We use 'Date.now()' to ensure all email are unique.
 *
 * @returns {string} - A gov uk email
 */
export function generateGovUKEmail() {
  return faker.internet.email({ provider: '@gov.uk' }).toLowerCase()
}

/**
 * Generate a unique email address (external)
 *
 * We use 'acceptance.test.' to delete all relevant test email address.
 *
 * We use 'Date.now()' to ensure all email are unique.
 *
 * @returns {string} - An email address
 */
export function generateExternalEmailAddress() {
  return faker.internet.email().toLowerCase()
}

/**
 * Generate a company email address
 *
 * Regex Explanation:
 * 1. /[^a-z0-9]+/g     - Replaces any sequence of non-alphanumeric characters (spaces, symbols) with a single hyphen.
 * 2. /^[-_]+|[-_]+$/g  - Strips any leftover hyphens or underscores from the start (^) or end ($) of the domain string.
 *
 * @param {string} companyName - The name of the company (e.g., "Hamill & Jones")
 * @returns {string} An email address (e.g., "daryl.denesik34@hamill-jones.com")
 */
export function generateCompanyEmailAddress(companyName) {
  const provider = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')

  return faker.internet.email({ provider: `${provider}.com` }).toLowerCase()
}

/**
 * Generates a company contact
 *
 * @param {string} companyName - The name of the company
 *
 * @returns {object} A company contact object
 */
export function generateCompanyContact(companyName) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  const provider = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')

  const email = faker.internet.email({ firstName, lastName, provider: `${provider}.com` }).toLowerCase()

  return {
    department: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email
  }
}
