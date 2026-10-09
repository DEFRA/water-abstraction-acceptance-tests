import populateLicences from './populate/licences.populate.js'

/**
 * Generate the data that populates the world when it is created from the CLI, on top of what the specs ask for
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateWorld() {
  return populateLicences()
}
