import addressData from '../data/address.data.js'
import buildBillRunEntities from '../entities/bill-runs.entities.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import companyAddressData from '../data/company-address.data.js'
import companyData from '../data/company.data.js'
import { includeInSrocSupplementaryBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { previousYears } from '../helpers/date.helpers.js'
import { regions } from '../default-values.js'

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

  return {
    ...mergeByKey(licenceEntity, secondCompany),
    ...billingAccountEntity,
    ...mergeByKey(chargeVersionEntity, additionalChargeEntity),
    ...mergeByKey(...billRunEntities)
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
