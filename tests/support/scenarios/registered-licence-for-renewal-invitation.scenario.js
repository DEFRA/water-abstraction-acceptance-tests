import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { formatDateToIso } from 'water-abstraction-engine/cli/world/helpers/date.helpers.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import primaryUserData from 'water-abstraction-engine/cli/world/data/primary-user.data.js'
import { groups, regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Registered licence for renewal invitation'
export const description =
  'Registered licence expiring more than 90 days ahead, making it eligible for a renewal invitation'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const licenceEntity = buildLicenceEntity(region)

  const primaryUser = primaryUserData(licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  // The expired date needs to be more than 90 days in the future for the licence to be eligible for a renewal invitation.
  const expiredDate = new Date()

  expiredDate.setDate(expiredDate.getDate() + 91)

  licenceEntity.licence.expiredDate = formatDateToIso(expiredDate)

  const internalUserEntity = buildInternalUserEntity(groups.PSC)

  return {
    ...licenceEntity,
    ...mergeByKey(internalUserEntity, primaryUser)
  }
}
