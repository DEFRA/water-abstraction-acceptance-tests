import { randomInt } from 'node:crypto'

import { generateUUID } from 'water-abstraction-engine/lib/general.lib.js'

import { regionCode } from '../default-values.js'

/**
 * Generate a unique licence reference
 *
 * Licence references must satisfy the service's `VALID_LICENCE_NUMBER` regex (uppercase letters, digits, and
 * `& ( ) * + , - . /` only), so the random part is built from an uppercased UUID with its hyphens stripped. The
 * `AT/TE/ST/` prefix is kept, and the random part is still `/` split, so the tear down service can still match on it
 * and it still reads like the legacy `AT/TE/ST/01/01` format.
 *
 * @returns {string} a unique licence reference, for example `AT/TE/ST/3F2A/9B1C`
 */
export function generateTestLicenceRef() {
  const unique = generateUUID().replace(/-/g, '').slice(0, 8).toUpperCase()

  return `AT/TE/ST/${unique.slice(0, 4)}/${unique.slice(4, 8)}`
}

/**
 * Generate a unique legacy-style external ID
 *
 * NALD-derived tables (points, licence versions, licence version purposes, ...) key off a `<region>:<id>` external
 * ID, sometimes with extra segments, for example `<region>:<id>:<issue>:<increment>` for a licence version. These
 * need to be unique per record, so rather than the previous fixed values we generate a random id for our test
 * region.
 *
 * @param {...(string|number)} suffixParts - extra segments appended after the random id, for example `1, 0` to
 * produce `9:1234567:1:0`
 *
 * @returns {string} a unique external ID, for example `9:1234567`
 */
export function generateTestExternalId(...suffixParts) {
  const naldId = randomInt(1000000, 9999999)

  return [regionCode, naldId, ...suffixParts].join(':')
}
