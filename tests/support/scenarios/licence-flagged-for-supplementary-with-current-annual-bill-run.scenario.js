import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { regions } from '../default-values.js'

export const title = 'Licence flagged for supplementary billing, and a sent annual bill run for the current year'
export const description =
  'A licence with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the current year, so a supplementary bill run picks up the one outstanding sroc period'

export default function (region = null) {
  if (!region) {
    region = regions.SOUTH_WEST
  }
  const { currentFinancialYear } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntity = buildBillRunEntity(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  // This is what flags the licence for the next sroc supplementary bill run — without it, fetch-charge-versions
  // (the query the supplementary engine uses to find what to bill) excludes the licence entirely
  licenceEntity.licence.includeInSrocBilling = true

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...billRunEntity
  }
}
