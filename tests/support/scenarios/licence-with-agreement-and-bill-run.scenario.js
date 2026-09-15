import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import licenceWithAgreementScenario from './licence-with-agreement.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'

export const title = 'Licence with an agreement and a bill run'
export const description =
  'A licence, licence holder (company), section 127 two-part tariff agreement, and a sent two-part tariff bill run.'

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (region = null) {
  if (!region) {
    region = regions.MIDLANDS
  }

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates()

  const licence = licenceWithAgreementScenario(region)
  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersionEntity = buildChargeVersionEntity(licence, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licence,
    billingAccountEntity,
    chargeVersionEntity,
    twoPartTariffDates,
    region
  )

  for (const billRunEntity of billRunEntities) {
    billRunEntity.billRun.batchType = 'two_part_tariff'
  }

  return {
    ...licence,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...mergeByKey(...billRunEntities)
  }
}
