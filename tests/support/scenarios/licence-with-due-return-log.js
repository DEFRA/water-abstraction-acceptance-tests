import company from '../data/company.js'
import licence from '../data/licence.js'
import point from '../data/point.js'
import primaryUser from '../data/primary-user.js'
import returnLog from '../data/return-log.js'
import returnRequirement from '../data/return-requirement.js'
import returnVersion from '../data/return-version.js'
import { compareDates, previousPeriod, today } from '../helpers/date.helpers.js'

export const title = 'Licence with a due return log'
export const description =
  'Licence with a due return log on a submittable past return period, with return requirements and version'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  // If the first return period ends in the future, we won't be able to interact with it. This scenario was written
  // for a number of our return log tests, that check we can add various types of return submissions. To ensure we
  // can interact with the return log, we bump the period back by one, so it ends in the past.
  let returnPeriod = firstReturnPeriod

  if (!compareDates(firstReturnPeriod.endDate, today())) {
    returnPeriod = previousPeriod(firstReturnPeriod)
  }

  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const primaryUserData = primaryUser('external@example.com', companyData)
  const licenceData = licence(licenceRef, companyData, primaryUserData)
  const pointData = point()
  const returnVersionData = returnVersion(licenceData)
  const returnRequirementData = returnRequirement(returnVersionData, pointData)
  const returnLogData = returnLog(licenceData, returnRequirementData, pointData, {
    startDate: returnPeriod.startDate,
    endDate: returnPeriod.endDate,
    dueDate: returnPeriod.dueDate,
    quarterly: returnPeriod.quarterly
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
