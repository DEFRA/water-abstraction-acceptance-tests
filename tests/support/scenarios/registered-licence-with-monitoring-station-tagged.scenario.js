import licenceMonitoringStationData from '../data/licence-monitoring-station.data.js'
import licenceVersionPurposeConditionData from '../data/licence-version-purpose-condition.data.js'
import registeredLicenceWithMonitoringStationUntaggedScenario from './registered-licence-with-monitoring-station-untagged.scenario.js'

export const title = 'Registered licence with monitoring station tagged'
export const description = 'Registered licence with a licence linked to a monitoring station'

/**
 * A tagged licence is linked to a monitoring station via a licenceMonitoringStation.
 *
 * We seed a separate 'licenceVersionPurposeCondition' on the licence, available for a test to select when tagging.
 */
export default function () {
  const licence = registeredLicenceWithMonitoringStationUntaggedScenario()

  const licenceVersionPurposeCondition = licenceVersionPurposeConditionData(licence.licenceVersionPurpose)
  const licenceMonitoringStation = licenceMonitoringStationData(licence.licence, licence.monitoringStation)

  return {
    ...licence,
    licenceVersionPurposeCondition,
    licenceMonitoringStation
  }
}
