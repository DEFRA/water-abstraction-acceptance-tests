import buildInternalUserEntity from '../entities/internal-user.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import monitoringStationData from '../data/monitoring-station.data.js'
import primaryUserData from '../data/primary-user.data.js'
import { groups, regions } from '../default-values.js'

export const title = 'Registered licence with a monitoring station (untagged)'
export const description = 'Registered licence and monitoring station created separately with no tag between them'

/**
 * The licence and monitoring station are seeded independently with no link between them.
 */
export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const licenceEntity = buildLicenceEntity(region)

  const primaryUser = primaryUserData(licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  const internalUserEntity = buildInternalUserEntity(groups.ENVIRONMENT_OFFICER)

  const monitoringStation = monitoringStationData()

  return {
    ...licenceEntity,
    ...mergeByKey(internalUserEntity, primaryUser),
    monitoringStation
  }
}
