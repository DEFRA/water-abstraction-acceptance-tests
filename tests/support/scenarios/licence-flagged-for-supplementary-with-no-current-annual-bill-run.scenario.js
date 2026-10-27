import buildBillRunEntities from 'water-abstraction-engine/cli/world/entities/bill-runs.entities.js'
import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/charge-version.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { calculatedDates } from 'water-abstraction-engine/cli/world/helpers/calculated-dates.helpers.js'
import { includeInSrocSupplementaryBilling } from 'water-abstraction-engine/cli/world/helpers/billing.helpers.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import { previousYears } from 'water-abstraction-engine/cli/world/helpers/date.helpers.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Licence flagged for supplementary billing with no current annual bill run'
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

  const billRunEntities = buildBillRunEntities(
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

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity),
    ...mergeByKey(...billRunEntities),
    ...internalUserEntity
  }
}
