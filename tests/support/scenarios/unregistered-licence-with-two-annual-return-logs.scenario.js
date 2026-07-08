import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with two annual return logs'
export const description =
  'Licence with one return requirement and two annual return logs across consecutive financial years'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)

  const period0 = {
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: currentWinterReturnCycle.dueDate,
    quarterly: false
  }

  const period1 = previousPeriod(period0)

  const returnLog0 = returnLogData(licence, returnRequirement, period0)
  const returnLog1 = returnLogData(licence, returnRequirement, period1)

  // The current period's log is left 'due'. The prior periods are treated as already submitted.
  returnLog1.returnLogs[0].status = 'completed'

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog0, returnLog1)
}
