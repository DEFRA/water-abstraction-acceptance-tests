import primaryUserData from '../data/primary-user.data.js'
import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence with open return log (first period)'
export const description = 'Registered licence with an open return log for the first return period with no due date set'

export default function (calculatedDates) {
  // We load in the unregistered open scenario because it has 99% of the data we need
  const licence = licenceWithOpenReturnLogForFirstPeriod(calculatedDates)

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData(externalUserEmail, licence)

  // Linking a primary user's company entity to the licence's 'licenceDocumentHeaders' is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeaders[0].companyEntityId = primaryUser.licenceEntityRoles[0].companyEntityId

  return mergeByKey(licence, primaryUser)
}
