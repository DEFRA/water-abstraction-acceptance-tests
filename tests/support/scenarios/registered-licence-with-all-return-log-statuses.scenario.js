import primaryUserData from '../data/primary-user.data.js'
import licenceWithAllReturnLogStatuses from './licence-with-all-return-log-statuses.scenario.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence with all return log statuses'
export const description = 'Registered licence with return logs covering all possible statuses'

export default function () {
  const licence = licenceWithAllReturnLogStatuses()

  const primaryUser = primaryUserData(externalUserEmail, licence.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licence,
    ...primaryUser
  }
}
