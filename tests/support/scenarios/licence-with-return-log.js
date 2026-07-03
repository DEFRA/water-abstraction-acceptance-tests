import company from '../data/company.js'
import licence from '../data/licence.js'
import returnLog from '../data/return-log.js'
import returnRequirement from '../data/return-requirement.js'
import returnVersion from '../data/return-version.js'

export const title = 'Licence with a return log (current period)'
export const description = 'Licence with a due return log for the first current return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const licenceRef = 'AT/TE/ST/01/01'

  const companyData = company()
  const licenceData = licence(licenceRef, companyData)
  const returnVersionData = returnVersion(licenceData)
  const returnRequirementData = returnRequirement(returnVersionData)
  const returnLogData = returnLog(licenceData, returnRequirementData, {
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  })

  return {
    ...companyData,
    ...licenceData,
    ...returnVersionData,
    ...returnRequirementData,
    ...returnLogData
  }
}
