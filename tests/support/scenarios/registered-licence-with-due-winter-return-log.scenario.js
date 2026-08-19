import primaryUserData from '../data/primary-user.data.js'
import licenceWithDueWinterReturnLog from './licence-with-due-winter-return-log.scenario.js'

export const title = 'Registered licence with a due return log (winter cycle)'
export const description =
  'Registered licence with one return requirement and a due winter return log for the previous winter cycle'

export default function () {
  // We load in the unregistered open scenario because it has 99% of the data we need
  const licence = licenceWithDueWinterReturnLog()

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData('external@example.com', licence.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licence,
    ...primaryUser
  }
}
