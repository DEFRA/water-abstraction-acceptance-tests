import buildLicenceEntity from '../../../tests/support/entities/licence.entity.js'
import { mergeByKey } from '../../../tests/support/helpers/scenario.helpers.js'
import { regions } from '../../../tests/support/default-values.js'

// How many licences to add for each region
const REGION_LICENCES = [
  { region: regions.ANGLIAN, licences: 28 },
  { region: regions.MIDLANDS, licences: 22 },
  { region: regions.SOUTH_WEST, licences: 16 },
  { region: regions.NORTH_EAST, licences: 13 },
  { region: regions.NORTH_WEST, licences: 8 },
  { region: regions.THAMES, licences: 6 },
  { region: regions.SOUTHERN, licences: 4 },
  { region: regions.WALES, licences: 3 }
]

/**
 * Generate the extra data the world only needs when created from the CLI, on top of what the specs ask for
 *
 * @returns {object} the extra data, keyed by database table name
 */
export default function extraWorld() {
  const licenceEntities = []

  for (const { region, licences } of REGION_LICENCES) {
    for (let i = 0; i < licences; i++) {
      licenceEntities.push(buildLicenceEntity(region))
    }
  }

  return mergeByKey(...licenceEntities)
}
