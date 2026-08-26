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
  return `${Date.now()}-${_additionalRandomness()}@acceptance.test.gov.uk`
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
  return `${Date.now()}-${_additionalRandomness()}@acceptance.test.com`
}

/**
 * We need some additional randomness
 *
 * We have seen timestamp collisions when we create multiple emails fro the same scenario
 *
 * We use this instead of a UUID to avoid confusion.
 *
 * @private
 */
function _additionalRandomness() {
  return Math.random().toString(36).slice(2, 10)
}
