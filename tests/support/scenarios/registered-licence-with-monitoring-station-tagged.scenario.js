import licenceMonitoringStationData from '../data/licence-monitoring-station.data.js'
import licenceVersionPurposeConditionData from '../data/licence-version-purpose-condition.data.js'
import registeredLicenceWithMonitoringStationUntaggedScenario from './registered-licence-with-monitoring-station-untagged.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Registered licence with monitoring station tagged'
export const description = 'Registered licence with a licence linked to a monitoring station'

/**
 * A tagged licence is linked to a monitoring station via a licenceMonitoringStation.
 *
 * We seed a separate 'licenceVersionPurposeCondition' on the licence, available for a test to select when tagging.
 */
export default function () {
  const registeredLicenceWithMonitoringStationUntagged = registeredLicenceWithMonitoringStationUntaggedScenario()

  const licenceVersionPurposeCondition = licenceVersionPurposeConditionData(
    registeredLicenceWithMonitoringStationUntagged
  )
  const licenceMonitoringStation = licenceMonitoringStationData(registeredLicenceWithMonitoringStationUntagged)

  return mergeByKey(
    registeredLicenceWithMonitoringStationUntagged,
    licenceVersionPurposeCondition,
    licenceMonitoringStation
  )
}
