import monitoringStationData from '../data/monitoring-station.data.js'
import { regions } from '../default-values.js'
import registeredLicenceScenario from './registered-licence.scenario.js'

export const title = 'Registered licence with a monitoring station (untagged)'
export const description = 'Registered licence and monitoring station created separately with no tag between them'

/**
 * The licence and monitoring station are seeded independently with no link between them.
 */
export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const registeredLicence = registeredLicenceScenario(region)
  const monitoringStation = monitoringStationData()

  return {
    ...registeredLicence,
    monitoringStation
  }
}
