import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'

export const title =
  'Licence flagged for supplementary billing, and sent annual bill runs from the charge version start date to the current year'
export const description =
  "A licence with a charge version flagged for the next supplementary bill run, plus sent annual bill runs for every financial year from the charge version's start date to the current one, so a supplementary bill run picks up the outstanding periods"

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }
  const { currentFinancialYear } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  const additionalChargeEntity = includeInSrocSupplementaryBilling(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    region
  )

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity),
    ...mergeByKey(...billRunEntities)
  }
}
