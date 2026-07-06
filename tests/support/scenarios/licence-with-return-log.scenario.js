import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import licenceScenario from './licence.scenario.js'

export const title = 'Licence with a return log (current period)'
export const description = 'Licence with a due return log for the first current return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const licence = licenceScenario()

  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)
  const returnLog = returnLogData(licence, returnRequirement, {
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  })

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog)
}
