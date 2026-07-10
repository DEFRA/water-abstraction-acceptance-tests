import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with an open return log (winter cycle)'
export const description =
  'Unregistered licence with one return requirement and an open winter return log for the previous winter cycle'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const period = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)

  const returnRequirement = returnRequirementData(returnVersion, licence)

  const returnLog = returnLogData(licence, returnRequirement, period)

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog)
}
