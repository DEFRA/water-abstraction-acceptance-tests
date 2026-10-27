import addressData from 'water-abstraction-engine/cli/world/data/address.data.js'
import buildBillRunEntities from 'water-abstraction-engine/cli/world/entities/bill-runs.entities.js'
import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import buildChargeVersionEntity from 'water-abstraction-engine/cli/world/entities/charge-version.entity.js'
import buildInternalUserEntity from 'water-abstraction-engine/cli/world/entities/internal-user.entity.js'
import buildLicenceEntity from 'water-abstraction-engine/cli/world/entities/licence.entity.js'
import { calculatedDates } from 'water-abstraction-engine/cli/world/helpers/calculated-dates.helpers.js'
import companyAddressData from 'water-abstraction-engine/cli/world/data/company-address.data.js'
import companyData from 'water-abstraction-engine/cli/world/data/company.data.js'
import { includeInSrocSupplementaryBilling } from 'water-abstraction-engine/cli/world/helpers/billing.helpers.js'
import { mergeByKey } from 'water-abstraction-engine/cli/world/helpers/scenario.helpers.js'
import { previousYears } from 'water-abstraction-engine/cli/world/helpers/date.helpers.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

export const title = 'Licence flagged for supplementary with second company'
export const description =
  "Licence flagged for supplementary billing with sent annual bill runs for every financial year from the charge version's start date (backdated two years) to the current one, so every outstanding period has something to bill, plus a second company and address so a new charge version can move the billing account to it"

export default function () {
  const region = regions.THAMES

  const { currentFinancialYear } = calculatedDates()

  const licenceStartDate = previousYears(currentFinancialYear.startDate, 2)

  const licenceEntity = buildLicenceEntity(region)

  // Without this, both the licence and its charge version only cover the last year or so (their default start
  // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
  licenceEntity.licence.startDate = licenceStartDate
  licenceEntity.licenceVersion.startDate = licenceStartDate
  licenceEntity.licenceDocument.startDate = licenceStartDate
  licenceEntity.licenceDocumentRole.startDate = licenceStartDate

  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const additionalChargeEntity = includeInSrocSupplementaryBilling(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    region
  )

  const secondCompany = _secondCompany(region)

  const billRunEntities = buildBillRunEntities(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  const internalUserEntity = buildInternalUserEntity()

  return {
    ...mergeByKey(licenceEntity, secondCompany),
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity),
    ...mergeByKey(...billRunEntities),
    ...internalUserEntity
  }
}

/**
 * Builds a second company and address, unconnected to the licence, so a new charge version can move the billing
 * account to it
 *
 * @private
 */
function _secondCompany(region) {
  const company = companyData(region)
  const address = addressData()
  const companyAddress = companyAddressData(company, address)

  return { company, address, companyAddress }
}
