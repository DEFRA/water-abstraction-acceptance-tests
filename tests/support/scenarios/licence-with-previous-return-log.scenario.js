import registeredLicenceScenario from './registered-licence.scenario.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a previous period return log'
export const description = 'Licence with a due return log set to the previous return period with no due date'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const previousReturnPeriod = previousPeriod(firstReturnPeriod)

  const registeredLicence = registeredLicenceScenario()

  const returnVersion = returnVersionData(registeredLicence)
  const returnRequirement = returnRequirementData(returnVersion, registeredLicence)
  const returnLog = returnLogData(registeredLicence, returnRequirement, {
    startDate: previousReturnPeriod.startDate,
    endDate: previousReturnPeriod.endDate,
    dueDate: null,
    quarterly: previousReturnPeriod.quarterly
  })

  return mergeByKey(registeredLicence, returnVersion, returnRequirement, returnLog)
}
