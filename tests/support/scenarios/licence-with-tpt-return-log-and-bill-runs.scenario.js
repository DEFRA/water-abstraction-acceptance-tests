import buildBillRunEntities from 'water-abstraction-engine/cli/world/entities/bill-runs.entities.js'
import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/charge-version.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import buildReturnVersionEntity from 'water-abstraction-engine/cli/world/entities/return-version.entity.js'
import { calculatedDates } from 'water-abstraction-engine/cli/world/helpers/calculated-dates.helpers.js'
import { markAsTwoPartTariff } from 'water-abstraction-engine/cli/world/helpers/billing.helpers.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'
import { buildReturnLogs, returnLogPeriods } from 'water-abstraction-engine/cli/world/helpers/return-log.helpers.js'

export const title = 'Licence with a two-part tariff return log and bill runs'
export const description =
  'Licence with a two-part tariff return version, completed return log ready for editing, and a sent two-part tariff bill run for the same year so editing the return flags the licence for two-part tariff supplementary billing'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_EAST
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

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...mergeByKey(...billRunEntities),
    ...returnVersionEntity,
    returnLog,
    ...internalUserEntity
  }
}
