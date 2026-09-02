import { asArrays } from '../helpers/wire-format.helpers.js'
import licenceMonitoringStationData from '../data/licence-monitoring-station.data.js'
import licenceVersionPurposeConditionData from '../data/licence-version-purpose-condition.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import monitoringStationData from '../data/monitoring-station.data.js'
import registeredLicenceScenario from './registered-licence.scenario.js'

export const title = 'Two registered licences with a monitoring station (tagged)'
export const description =
  'Two registered licences both tagged to the same monitoring station, each with a different abstraction period so an alert can be filtered down to one of them'

/**
 * Both tagged licences are linked to the same monitoring station via a licenceMonitoringStation.
 *
 * We seed a separate 'licenceVersionPurposeCondition' on each licence, available for a test to select when tagging.
 */
export default function () {
  const monitoringStation = monitoringStationData()

  const firstLicence = _taggedLicence(monitoringStation)
  const secondLicence = _taggedLicence(monitoringStation)

  secondLicence.licenceMonitoringStation.abstractionPeriodStartDay = 1
  secondLicence.licenceMonitoringStation.abstractionPeriodStartMonth = 4
  secondLicence.licenceMonitoringStation.abstractionPeriodEndDay = 31
  secondLicence.licenceMonitoringStation.abstractionPeriodEndMonth = 3

  return {
    monitoringStation,
    ...mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
  }
}

/**
 * Builds a registered licence tagged to the monitoring station
 *
 * @private
 */
function _taggedLicence(monitoringStation) {
  const registeredLicence = registeredLicenceScenario()

  const licenceVersionPurposeCondition = licenceVersionPurposeConditionData(registeredLicence.licenceVersionPurpose)
  const licenceMonitoringStation = licenceMonitoringStationData(registeredLicence.licence, monitoringStation)

  return {
    ...registeredLicence,
    licenceVersionPurposeCondition,
    licenceMonitoringStation
  }
}
