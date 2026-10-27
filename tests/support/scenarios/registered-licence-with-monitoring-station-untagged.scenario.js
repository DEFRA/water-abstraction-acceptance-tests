import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import primaryUserData from 'water-abstraction-engine/cli/world/data/primary-user.data.js'
import { groups, regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Registered licence with a monitoring station (untagged)'
export const description = 'Registered licence with no tag to a monitoring station'

/**
 * The licence is not tagged to a monitoring station.
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

  return {
    ...licenceEntity,
    ...mergeByKey(internalUserEntity, primaryUser)
  }
}
