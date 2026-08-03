import billRunData from '../data/bill-run.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

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

  const returnVersion = returnVersionData(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersion.returnVersions[0].startDate = previousPeriodDetails.startDate

  const {
    licenceVersionPurposes: [licenceVersionPurpose],
    points
  } = licence

  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose, points)

  returnRequirement.returnRequirements[0].twoPartTariff = true

  const returnLog = returnLogData(licence, returnRequirement, previousPeriodDetails)

  returnLog.returnLogs[0].status = 'completed'

  const financialYearEnding = previousPeriodDetails.endDate.getFullYear()

  const billRun = billRunData()

  billRun.billRuns[0].batchType = 'two_part_tariff'
  billRun.billRuns[0].fromFinancialYearEnding = financialYearEnding
  billRun.billRuns[0].toFinancialYearEnding = financialYearEnding

  return mergeByKey(licence, returnVersion, returnRequirement, returnLog, billRun)
}
