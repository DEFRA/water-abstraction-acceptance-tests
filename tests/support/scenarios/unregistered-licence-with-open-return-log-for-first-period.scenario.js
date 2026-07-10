import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with open return log (first period)'
export const description =
  'Unregistered licence with an open return log for the first return period with no due date set'

export default function (calculatedDates) {
  const { firstReturnPeriod } = calculatedDates

  const period0 = {
    startDate: firstReturnPeriod.startDate,
    endDate: firstReturnPeriod.endDate,
    dueDate: null,
    quarterly: firstReturnPeriod.quarterly
  }

  const unregisteredLicence = unregisteredLicenceScenario()

  // We want the return logs for the licence to match with the first quarter shown in the journey. This is dynamically
  // calculated based on the current date, so could be a quarterly period, or the winter or summer cycle.
  // Only licences flagged as water undertakers are eligible for quarterly returns, so we ensure the licence aligns.
  unregisteredLicence.licences[0].waterUndertaker = firstReturnPeriod.quarterly

  const returnVersion = returnVersionData(unregisteredLicence)

  const returnRequirement = returnRequirementData(returnVersion, unregisteredLicence)

  const returnLog = returnLogData(unregisteredLicence, returnRequirement, period0)

  return mergeByKey(unregisteredLicence, returnVersion, returnRequirement, returnLog)
}
