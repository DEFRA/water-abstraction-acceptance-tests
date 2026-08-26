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
 * Generates a return requirement reference
 *
 * The reference is in the format '999#####', 7 digits starting '999'. We keep it below 10,000,000 because that's
 * where `water.return_reference_seq` starts - the sequence Postgres uses to assign a reference when the app itself
 * creates a return requirement (for example, through a 'submit new return version' journey). Staying below it means
 * our seeded data and anything the app creates live during a test sort in a consistent, predictable order relative
 * to each other.
 *
 * We don't use the engine's own `generateReference()` because its range (10,000,000-99,999,999) overlaps that same
 * sequence, which introduces exactly the ordering ambiguity we're trying to avoid.
 *
 * @returns {number} - A return requirement reference
 */
export function generateReturnRequirementReference() {
  const suffix = generateRandomInteger(0, 9999).toString().padStart(4, '0')

  return Number(`999${suffix}`)
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
