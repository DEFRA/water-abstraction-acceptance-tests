import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with a not due yet return log'
export const description =
  'Unregistered licence with a return log in the current financial year, with return requirements and version'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const unregisteredLicence = unregisteredLicenceScenario()

  const returnVersion = returnVersionData(unregisteredLicence)
  const returnRequirement = returnRequirementData(returnVersion, unregisteredLicence)

  // The requirement's purpose must match the licence's actual licence version purpose (legacy ID 140, set up by
  // unregisteredLicenceScenario), otherwise copying it into a new return version fails when the app tries to
  // resolve the primary/secondary purpose ids
  returnRequirement.returnRequirementPurposes[0].purposeId.value = '140'

  const returnLog = returnLogData(unregisteredLicence, returnRequirement, {
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: currentWinterReturnCycle.dueDate,
    quarterly: false
  })

  return mergeByKey(unregisteredLicence, returnVersion, returnRequirement, returnLog)
}
