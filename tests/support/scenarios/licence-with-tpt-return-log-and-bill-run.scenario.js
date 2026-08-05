import billRunData from '../data/bill-run.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
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

  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const returnVersion = returnVersionData(licenceEntity.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licenceEntity.licenceVersionPurpose)

  returnRequirement.twoPartTariff = true

  const returnRequirementPoint = returnRequirementPointData(returnRequirement, licenceEntity.point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceEntity.licenceVersionPurpose)

  const returnLog = returnLogData(
    licenceEntity.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [licenceEntity.point],
    previousPeriodDetails
  )

  returnLog.status = 'completed'

  const financialYearEnding = previousPeriodDetails.endDate.getFullYear()

  const billRun = billRunData()

  billRun.batchType = 'two_part_tariff'
  billRun.fromFinancialYearEnding = financialYearEnding
  billRun.toFinancialYearEnding = financialYearEnding

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLog,
    billRun
  }
}
