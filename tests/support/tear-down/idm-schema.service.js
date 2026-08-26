/**
 * Removes all data created for acceptance tests from the idm schema
 * @module IdmSchemaService
 */

import { db } from 'water-abstraction-engine/db/db.js'

/**
 * Removes all data created for acceptance tests from the idm schema
 *
 * @returns {Promise<object>}
 */
export default async function idmSchemaService() {
  return _deleteAllTestData()
}

async function _deleteAllTestData() {
  return db.raw(`
  DELETE
  FROM
    "idm"."users"
  WHERE "user_name" LIKE '%acceptance.test%'
  `)
}
