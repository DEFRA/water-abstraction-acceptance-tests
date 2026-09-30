import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import primaryUserData from '../data/primary-user.data.js'
import { regions } from '../default-values.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Registered licence for a single-use recipient'
export const description =
  'Registered licence with an open winter return log, used to add single-use recipients to an ad-hoc notice'

export default function (region = null) {
  if (!region) {
    region = regions.THAMES
  }

  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity(region)

  const returnVersionEntity = buildReturnVersionEntity(licenceEntity)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods,
    region
  )

  // We then add the primary user, which is what makes the licence 'registered'
  const primaryUser = primaryUserData(licenceEntity.company)

  // Linking a primary user's company entity to the licence's licence document header is the only way we can link a
  // registered licence to a licence holder.
  licenceEntity.licenceDocumentHeader.companyEntityId = primaryUser.licenceEntityRole.companyEntityId

  return {
    ...licenceEntity,
    ...returnVersionEntity,
    returnLogs,
    ...primaryUser
  }
}
