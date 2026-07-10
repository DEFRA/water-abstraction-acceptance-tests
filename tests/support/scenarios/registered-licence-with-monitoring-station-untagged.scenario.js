import monitoringStationData from '../data/monitoring-station.data.js'
import registeredLicenceScenario from './registered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Registered licence with monitoring station (untagged)'
export const description = 'Registered licence and monitoring station created separately with no tag between them'

/**
 * The licence and monitoring station are seeded independently with no link between them.
 */
export default function () {
  const registeredLicence = registeredLicenceScenario()
  const monitoringStation = monitoringStationData()

  return mergeByKey(registeredLicence, monitoringStation)
}
