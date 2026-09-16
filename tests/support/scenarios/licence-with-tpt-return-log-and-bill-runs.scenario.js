import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { markAsTwoPartTariff } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff return log and bill runs'
export const description =
  'Licence with a two-part tariff return version, completed return log ready for editing, and a sent two-part tariff bill run for the same year so editing the return flags the licence for two-part tariff supplementary billing'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }

  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    periods[0],
    region
  )

  markAsTwoPartTariff(billRunEntities)

  const returnVersionEntity = buildReturnVersionEntity(licenceEntity)

  returnVersionEntity.returnRequirement.twoPartTariff = true

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [returnLog] = buildReturnLogs(
    licenceEntity.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods,
    region
  )

  returnLog.status = 'completed'

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...mergeByKey(...billRunEntities),
    ...returnVersionEntity,
    returnLog
  }
}
