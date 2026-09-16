import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { markAsTwoPartTariff } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'
import workflowData from '../data/workflow.data.js'
import { yesterday } from '../helpers/date.helpers.js'

export const title = 'Licence in workflow, and two-part tariff bill runs'
export const description =
  "Licence in workflow, and a sent two-part tariff bill run, with the workflow entry created before the bill run's end date so it can test supp. flagging behaviour"

/**
 * For a bill run to exist, there needs to be a charge version.
 *
 * This is omitted from the scenario name and description to keep them concise, but is still part of the scenario.
 */
export default function (region = null) {
  if (!region) {
    region = regions.NORTH_WEST
  }

  const licenceEntity = buildLicenceEntity(region)

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffDates]
    }
  } = calculatedDates()

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    twoPartTariffDates,
    region
  )

  markAsTwoPartTariff(billRunEntities)

  const workflow = workflowData(licenceEntity.licence)

  // The workflow createdAt date is used to show the supplementary billing flag.
  // It should be set to a date before the two-part tariff bill run's end date.
  workflow.createdAt = `${new Date(twoPartTariffDates.endDate).getUTCFullYear()}-01-01`
  workflow.updatedAt = yesterday()

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...mergeByKey(...billRunEntities),
    workflow
  }
}
