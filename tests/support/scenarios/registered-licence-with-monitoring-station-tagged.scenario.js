import licenceMonitoringStationData from 'water-abstraction-engine/cli/world/data/licence-monitoring-station.data.js'
import licenceVersionPurposeConditionData from 'water-abstraction-engine/cli/world/data/licence-version-purpose-condition.data.js'
import { monitoringStations, regions } from 'water-abstraction-engine/cli/world/default-values.js'

import registeredLicenceWithMonitoringStationUntaggedScenario from './registered-licence-with-monitoring-station-untagged.scenario.js'

export const title = 'Registered licence with a monitoring station (tagged)'
export const description = 'Registered licence with a licence linked to a monitoring station'

/**
 * A tagged licence is linked to a monitoring station via a licenceMonitoringStation.
 *
 * We seed a separate 'licenceVersionPurposeCondition' on the licence, available for a test to select when tagging.
 */
export default function (region = null) {
  if (!region) {
    region = regions.NORTH_WEST
  }

  const licence = registeredLicenceWithMonitoringStationUntaggedScenario(region)

  const licenceVersionPurposeCondition = licenceVersionPurposeConditionData(licence.licenceVersionPurpose)
  const licenceMonitoringStation = licenceMonitoringStationData(licence.licence, monitoringStations.SECOND)

  return {
    ...licence,
    licenceVersionPurposeCondition,
    licenceMonitoringStation
  }
}
