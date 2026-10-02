import buildInternalUserEntity from '../entities/internal-user.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import licenceMonitoringStationData from '../data/licence-monitoring-station.data.js'
import licenceVersionPurposeConditionData from '../data/licence-version-purpose-condition.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import monitoringStationData from '../data/monitoring-station.data.js'
import primaryUserData from '../data/primary-user.data.js'
import { groups, regions } from '../default-values.js'

export const title = 'Registered licences with a monitoring station (tagged)'
export const description =
  'Two registered licences both tagged to the same monitoring station, each with a different abstraction period so an alert can be filtered down to one of them'

/**
 * Both tagged licences are linked to the same monitoring station via a licenceMonitoringStation.
 *
 * We seed a separate 'licenceVersionPurposeCondition' on the licence, available for a test to select when tagging.
 */
export default function (region = null) {
  if (!region) {
    region = regions.ANGLIAN
  }

  const monitoringStation = monitoringStationData()

  const firstLicence = _taggedLicence(monitoringStation, region)
  const secondLicence = _taggedLicence(monitoringStation, region)

  secondLicence.licenceMonitoringStation.abstractionPeriodStartDay = 1
  secondLicence.licenceMonitoringStation.abstractionPeriodStartMonth = 4
  secondLicence.licenceMonitoringStation.abstractionPeriodEndDay = 31
  secondLicence.licenceMonitoringStation.abstractionPeriodEndMonth = 3

  return {
    monitoringStation,
    ...mergeByKey(firstLicence, secondLicence)
  }
}

/**
 * Builds a registered licence tagged to the monitoring station
 *
 * @private
 */
function _taggedLicence(monitoringStation, region) {
  const licenceEntity = buildLicenceEntity(region)

  const primaryUser = primaryUserData(licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  const internalUserEntity = buildInternalUserEntity(groups.ENVIRONMENT_OFFICER)

  const licenceVersionPurposeCondition = licenceVersionPurposeConditionData(licenceEntity.licenceVersionPurpose)
  const licenceMonitoringStation = licenceMonitoringStationData(licenceEntity.licence, monitoringStation)

  return {
    ...licenceEntity,
    ...mergeByKey(internalUserEntity, primaryUser),
    licenceVersionPurposeCondition,
    licenceMonitoringStation
  }
}
