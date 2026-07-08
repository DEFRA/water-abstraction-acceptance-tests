import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with four quarterly return logs'
export const description =
  'Licence with one return requirement and four quarterly return logs for the current financial year'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licence = unregisteredLicenceScenario()
  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)

  const endYear = new Date(currentWinterReturnCycle.endDate).getFullYear()

  // Quarter four (January to March) shares its end and due date with the winter and all year cycle
  const period0 = {
    startDate: `${endYear}-01-01`,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: currentWinterReturnCycle.dueDate,
    quarterly: true
  }
  const period1 = previousPeriod(period0)
  const period2 = previousPeriod(period1)
  const period3 = previousPeriod(period2)

  const returnLog0 = returnLogData(licence, returnRequirement, period0)
  const returnLog1 = returnLogData(licence, returnRequirement, period1)
  const returnLog2 = returnLogData(licence, returnRequirement, period2)
  const returnLog3 = returnLogData(licence, returnRequirement, period3)

  // The current quarter's log is left 'due'. The three prior quarters are treated as already submitted.
  returnLog1.returnLogs[0].status = 'completed'
  returnLog2.returnLogs[0].status = 'completed'
  returnLog3.returnLogs[0].status = 'completed'

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog0, returnLog1, returnLog2, returnLog3)
}
