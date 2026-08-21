import primaryUserData from '../data/primary-user.data.js'
import licenceWithOpenReturnLogForFirstPeriod from './licence-with-open-return-log-for-first-period.scenario.js'
import { externalUserEmail } from '../default-values.js'

export const title = 'Registered licence with an open return log (first period)'
export const description = 'Registered licence with an open return log for the first return period with no due date set'

export default function () {
  // We load in the unregistered open scenario because it has 99% of the data we need
  const licence = licenceWithOpenReturnLogForFirstPeriod()

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData(externalUserEmail, licence.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licence,
    ...primaryUser
  }
}
