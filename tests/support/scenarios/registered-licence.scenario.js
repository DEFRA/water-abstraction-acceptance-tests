import buildInternalUserEntity from '../entities/internal-user.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import primaryUserData from '../data/primary-user.data.js'
import { regions } from '../default-values.js'

export const title = 'Registered licence'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function (region = null) {
  if (!region) {
    region = regions.WALES
  }

  const licenceEntity = buildLicenceEntity(region)

  const primaryUser = primaryUserData(licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...mergeByKey(internalUserEntity, primaryUser)
  }
}
