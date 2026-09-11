import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions, srocStartDate } from '../default-values.js'

export const title =
  'Licence flagged for supplementary billing with a full sroc charge history, and a sent annual bill run for the current year'
export const description =
  'The current-year annual bill run scenario, with the licence and its charge version starting on the sroc scheme start date so every outstanding sroc period has something to bill'

export default function () {
  const region = regions.NORTH_WEST

  const { currentFinancialYear } = calculatedDates()

  const licenceEntity = buildLicenceEntity(region)

  // Without this, both the licence and its charge version only cover the last year or so (their default start
  // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
  licenceEntity.licence.startDate = srocStartDate
  licenceEntity.licenceVersion.startDate = srocStartDate
  licenceEntity.licenceDocument.startDate = srocStartDate
  licenceEntity.licenceDocumentRole.startDate = srocStartDate

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const billRunEntity = buildBillRunEntity(
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
    ...mergeByKey(asArrays(chargeVersionEntity), asArrays(additionalChargeEntity)),
    ...billRunEntity
  }
}
