import billRunData from '../data/bill-run.data.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import { buildReturnLogs } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff return log and bill run'
export const description =
  'Licence with a two-part tariff return version, completed return log ready for editing, and a sent two-part tariff bill run for the same year so editing the return flags the licence for two-part tariff supplementary billing'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const returnRequirementEntity = buildReturnRequirementEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  returnRequirementEntity.returnRequirement.twoPartTariff = true

  const [returnLog] = buildReturnLogs(
    licenceEntity.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    licenceEntity.point,
    currentWinterReturnCycle
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = returnLog.startDate

  returnLog.status = 'completed'

  const financialYearEnding = new Date(returnLog.endDate).getFullYear()

  const billRun = billRunData()

  billRun.batchType = 'two_part_tariff'
  billRun.fromFinancialYearEnding = financialYearEnding
  billRun.toFinancialYearEnding = financialYearEnding

  return {
    ...licenceEntity,
    ...chargeVersionEntity,
    ...returnRequirementEntity,
    returnLog,
    billRun
  }
}
