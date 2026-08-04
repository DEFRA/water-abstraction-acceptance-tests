import primaryUserData from '../data/primary-user.data.js'
import licenceScenario from './licence.scenario.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const licence = licenceScenario()

  const primaryUser = primaryUserData(externalUserEmail, licence.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licence,
    ...primaryUser
  }
}
