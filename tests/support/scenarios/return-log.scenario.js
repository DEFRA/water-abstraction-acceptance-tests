import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Add a return log'
export const description = 'A return log this has a licence, defaulted to an unregistered licence'

export default function (returnPeriod, licence = null) {
  if (!licence) {
    licence = unregisteredLicenceScenario()
  }

  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)
  const returnLog = returnLogData(licence, returnRequirement, {
    startDate: returnPeriod.startDate,
    endDate: returnPeriod.endDate,
    dueDate: returnPeriod.dueDate,
    quarterly: returnPeriod.quarterly
  })

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog)
}
