import primaryUserData from '../data/primary-user.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Registered licence'
export const description = 'A licence that has been registered (primary user), licence holder and a company'

export default function (licenceRef = 'AT/TE/ST/01/01', email = 'external@example.com') {
  const unregisteredLicence = unregisteredLicenceScenario(licenceRef)

  const primaryUser = primaryUserData(email, unregisteredLicence)

  // Linking a primary user's company entity to the licence's 'licenceDocumentHeaders' is the only way we can link a
  // registered licence to a licence holder.
  unregisteredLicence.licenceDocumentHeaders[0].companyEntityId = primaryUser.licenceEntityRoles[0].companyEntityId

  return mergeByKey(unregisteredLicence, primaryUser)
}
