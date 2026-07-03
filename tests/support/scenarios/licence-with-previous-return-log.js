import company from '../data/company.js'
import licence from '../data/licence.js'
import point from '../data/point.js'
import primaryUser from '../data/primary-user.js'
import returnLog from '../data/return-log.js'
import returnRequirement from '../data/return-requirement.js'
import returnVersion from '../data/return-version.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with a previous period return log'
export const description = 'Licence with a due return log set to the previous return period with no due date'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const previousReturnPeriod = previousPeriod(firstReturnPeriod)

  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const primaryUserData = primaryUser('external@example.com', companyData)
  const licenceData = licence(licenceRef, companyData, primaryUserData)
  const pointData = point()
  const returnVersionData = returnVersion(licenceData)
  const returnRequirementData = returnRequirement(returnVersionData, pointData)
  const returnLogData = returnLog(licenceData, returnRequirementData, pointData, {
    startDate: previousReturnPeriod.startDate,
    endDate: previousReturnPeriod.endDate,
    dueDate: null,
    quarterly: previousReturnPeriod.quarterly
  })

  return {
    ...companyData,
    ...primaryUserData,
    ...licenceData,
    ...pointData,
    ...returnVersionData,
    ...returnRequirementData,
    ...returnLogData
  }
}
