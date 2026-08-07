import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff return log and bill run'
export const description =
  'Licence with a two-part tariff return version, completed return log ready for editing, and a sent two-part tariff bill run for the same year so editing the return flags the licence for two-part tariff supplementary billing'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity()
  const billRunEntity = buildBillRunEntity(licenceEntity, periods[0])

  billRunEntity.billRun.batchType = 'two_part_tariff'

  const returnRequirementEntity = buildReturnRequirementEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  returnRequirementEntity.returnRequirement.twoPartTariff = true

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = periods[0].startDate

  const [returnLog] = buildReturnLogs(
    licenceEntity.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods
  )

  returnLog.status = 'completed'

  return {
    ...licenceEntity,
    ...billRunEntity,
    ...returnRequirementEntity,
    returnLog
  }
}
