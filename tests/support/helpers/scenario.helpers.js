/**
 * Merges multiple scenario data objects into one, concatenating array values that share the same key
 *
 * Scenario data objects are keyed by database table name, for example `{ contacts: [...], companyContacts:
 * [...] }`. When two objects being merged share a key, their arrays are concatenated rather than one
 * overwriting the other, so every record still gets seeded.
 *
 * @param {...object} scenarioDataObjects - The scenario data objects to merge
 *
 * @returns {object} A single object with all keys merged, concatenating arrays for keys shared across the inputs
 */
export function mergeByKey(...scenarioDataObjects) {
  return scenarioDataObjects.reduce((merged, current) => {
    for (const key of Object.keys(current)) {
      merged[key] = [...(merged[key] ?? []), ...current[key]]
    }
    return merged
  }, {})
}
