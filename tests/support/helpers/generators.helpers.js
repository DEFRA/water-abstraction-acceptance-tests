import { generateRandomInteger } from 'water-abstraction-engine/test/generators.js'

import { regionCode } from '../default-values.js'

/**
 * Generates a Bill run number
 *
 * @returns {string} - A bill run number
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
