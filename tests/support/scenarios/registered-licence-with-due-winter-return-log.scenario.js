import licenceWithDueWinterReturnLog from './licence-with-due-winter-return-log.scenario.js'
import primaryUserData from '../data/primary-user.data.js'
import { regions } from '../default-values.js'

export const title = 'Registered licence with a due return log (winter cycle)'
export const description =
  'Registered licence with one return requirement and a due winter return log for the previous winter cycle'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_EAST
  }

  // We load in the unregistered open scenario because it has 99% of the data we need
  const licence = licenceWithDueWinterReturnLog(region)

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData(licence.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licence.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licence,
    ...primaryUser
  }
}
