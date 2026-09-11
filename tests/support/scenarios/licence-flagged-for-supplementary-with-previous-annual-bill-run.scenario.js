import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { previousYears } from '../helpers/date.helpers.js'
import { regions } from '../default-values.js'

export const title = 'Licence flagged for supplementary billing with previous annual bill run'
export const description =
  'A licence starting on the day the sroc scheme began, with a charge version flagged for the next supplementary bill run, plus a sent annual bill run for the year before the current one, so a supplementary bill run has no annual in the current year to pick up from'

export default function () {
  const region = regions.NORTH_EAST

  const { currentFinancialYear } = calculatedDates()

  const licenceStartDate = previousYears(currentFinancialYear.startDate, 1)

  const licenceEntity = buildLicenceEntity(region)

  licenceEntity.licence.startDate = licenceStartDate
  licenceEntity.licenceVersion.startDate = licenceStartDate
  licenceEntity.licenceDocument.startDate = licenceStartDate
  licenceEntity.licenceDocumentRole.startDate = licenceStartDate

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)

  const billRunEntity = buildBillRunEntity(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    {
      startDate: previousYears(currentFinancialYear.startDate, 1),
      endDate: previousYears(currentFinancialYear.endDate, 1)
    },
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
