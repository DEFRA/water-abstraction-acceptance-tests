import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'

export const title = 'Licence with a return log (current period)'
export const description = 'Licence with a due return log for the first current return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const unregisteredLicence = unregisteredLicenceScenario()

  const returnVersion = returnVersionData(unregisteredLicence)
  const returnRequirement = returnRequirementData(returnVersion, unregisteredLicence)
  const returnLog = returnLogData(unregisteredLicence, returnRequirement, {
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  })

  return mergeByKey(unregisteredLicence, returnVersion, returnRequirement, returnLog)
}
