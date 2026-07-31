import billRunData from '../data/bill-run.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with a two-part tariff return log and bill run'
export const description =
  'Licence with a two-part tariff return version, completed return log ready for editing, and a sent two-part tariff bill run for the same year so editing the return flags the licence for two-part tariff supplementary billing'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const licence = licenceWithChargeVersionScenario()

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licence.licenceVersionPurpose)

  returnRequirement.twoPartTariff = true

  const returnRequirementPoint = returnRequirementPointData(returnRequirement, licence.point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licence.licenceVersionPurpose)

  const returnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licence.point],
    previousPeriodDetails
  )

  returnLog.status = 'completed'

  const financialYearEnding = previousPeriodDetails.endDate.getFullYear()

  const billRun = billRunData()

  billRun.batchType = 'two_part_tariff'
  billRun.fromFinancialYearEnding = financialYearEnding
  billRun.toFinancialYearEnding = financialYearEnding

  return {
    ...licence,
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLog,
    billRun
  }
}
