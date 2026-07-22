import primaryUserData from '../data/primary-user.data.js'
import licenceWithOpenWinterReturnLog from './licence-with-open-winter-return-log.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Registered licence with an open return log (winter cycle)'
export const description =
  'Registered licence with one return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  // We load in the unregistered open scenario because it has 99% of the data we need
  const licence = licenceWithOpenWinterReturnLog(calculatedDates)

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData('external@example.com', licence)

  // Linking a primary user's company entity to the licence's 'licenceDocumentHeaders' is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeaders[0].companyEntityId = primaryUser.licenceEntityRoles[0].companyEntityId

  return mergeByKey(licence, primaryUser)
}
