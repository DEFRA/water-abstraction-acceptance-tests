import chargeReferenceData from '../data/charge-reference.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceWithChargeVersionScenario from './unregistered-licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Two-part tariff review 01'
export const description =
  'Testing a two-part tariff bill run with a simple scenario, licence is current and not in workflow, it has one applicable charge version with a single charge reference and element both of which are 2pt. It has just one return, and it and the charge element exactly match'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const unregisteredLicenceWithChargeVersion = unregisteredLicenceWithChargeVersionScenario()

  const chargeReference = chargeReferenceData(unregisteredLicenceWithChargeVersion)
  const returnVersion = returnVersionData(unregisteredLicenceWithChargeVersion)

  const returnRequirement = returnRequirementData(returnVersion, unregisteredLicenceWithChargeVersion)
  returnRequirement.returnRequirements[0].collectionFrequency = 'month'
  returnRequirement.returnRequirements[0].reportingFrequency = 'month'

  const returnLog = returnLogData(unregisteredLicenceWithChargeVersion, returnRequirement, previousPeriodDetails)
  returnLog.returnLogs[0].metadata.isTwoPartTariff = true
  returnLog.returnLogs[0].status = 'completed'

  const returnSubmission = returnSubmissionData(previousPeriodDetails, returnLog)

  return mergeByKey(
    unregisteredLicenceWithChargeVersion,
    chargeReference,
    returnVersion,
    returnRequirement,
    returnLog,
    returnSubmission
  )
}
