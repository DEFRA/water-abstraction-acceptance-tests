import primaryUserData from '../data/primary-user.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function () {
  const unregisteredLicence = unregisteredLicenceScenario()

  const primaryUser = primaryUserData(externalUserEmail, unregisteredLicence)

  // Linking a primary user's company entity to the licence's 'licenceDocumentHeaders' is the only way we can link a
  // registered licence to a licence holder.
  unregisteredLicence.licenceDocumentHeaders[0].companyEntityId = primaryUser.licenceEntityRoles[0].companyEntityId

  return mergeByKey(unregisteredLicence, primaryUser)
}
