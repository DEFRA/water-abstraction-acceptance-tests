import returnLog from '../data/return-log.js'
import returnRequirement from '../data/return-requirement.js'
import returnVersion from '../data/return-version.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import licenceScenario from './licence.js'

export const title = 'Licence with a return log (current period)'
export const description = 'Licence with a due return log for the first current return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const baseLicence = licenceScenario()

  const returnVersionData = returnVersion(baseLicence)
  const returnRequirementData = returnRequirement(returnVersionData, baseLicence)
  const returnLogData = returnLog(baseLicence, returnRequirementData, {
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  })

  return mergeByKey(baseLicence, returnVersionData, returnRequirementData, returnLogData)
}
