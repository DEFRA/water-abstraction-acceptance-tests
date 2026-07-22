import primaryUserData from '../data/primary-user.data.js'
import licenceWithAllReturnLogStatuses from './licence-with-all-return-log-statuses.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence with all return log statuses'
export const description = 'Registered licence with return logs covering all possible statuses'

export default function (calculatedDates) {
  const licence = licenceWithAllReturnLogStatuses(calculatedDates)

  const primaryUser = primaryUserData(externalUserEmail, licence)

  // Linking a primary user's company entity to the licence's 'licenceDocumentHeaders' is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeaders[0].companyEntityId = primaryUser.licenceEntityRoles[0].companyEntityId

  return mergeByKey(licence, primaryUser)
}
