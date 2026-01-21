'use strict'

/**
 * Generate a Universally Unique Identifier (UUID)
 * @module GenerateUUID
 */

const { randomUUID } = require('node:crypto')

/**
 * Generate a Universally Unique Identifier (UUID)
 *
 * The service uses these as the IDs for most records in the DB. Most tables will automatically generate them when
 * the record is created but not all do. There are also times when it is either more performant, simpler, or both for
 * us to generate the ID before inserting a new record. For example, we can pass the generated ID to child records to
 * set the foreign key relationship.
 *
 * NOTE: We set `disableEntropyCache` to `false` as normally, for performance reasons node caches enough random data to
 * generate up to 128 UUIDs. We disable this as we may need to generate more than this and the performance hit in
 * disabling this cache is a rounding error in comparison to the rest of the process.
 *
 * https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
 *
 * @returns {string} a randomly generated UUID
 */
export default function () {
  return randomUUID({ disableEntropyCache: true })
}
