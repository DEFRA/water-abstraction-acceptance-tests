import primaryUserData from '../data/primary-user.data.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const licenceEntity = buildLicenceEntity()

  const primaryUser = primaryUserData(externalUserEmail, licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licenceEntity,
    ...primaryUser
  }
}
