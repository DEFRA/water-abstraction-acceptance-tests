import addressData from '../data/address.data.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import buildBillRunEntity from '../entities/bill-run.entity.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import companyAddressData from '../data/company-address.data.js'
import companyData from '../data/company.data.js'
import { includeInSrocBilling } from '../helpers/billing.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { previousYears } from '../helpers/date.helpers.js'
import { regions } from '../default-values.js'

export const title =
  'Licence flagged for supplementary billing with a sent annual bill run for the current year, plus a second company'
export const description =
  'The current-year annual bill run scenario, with its charge version starting on the sroc scheme start date so every outstanding sroc period has something to bill, plus a second company and address so a new charge version can move the billing account to it'

export default function () {
  const region = regions.NORTH_EAST

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
  const billRunEntity = buildBillRunEntity(
    licenceEntity,
    billingAccountEntity,
    chargeVersionEntity,
    currentFinancialYear,
    region
  )

  const additionalChargeEntity = includeInSrocBilling(licenceEntity, billingAccountEntity, chargeVersionEntity, region)

  const secondCompany = _secondCompany(region)

  return {
    ...mergeByKey(asArrays(licenceEntity), asArrays(secondCompany)),
    ...billingAccountEntity,
    ...mergeByKey(asArrays(chargeVersionEntity), asArrays(additionalChargeEntity)),
    ...billRunEntity
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

  // Not required by the database, but makes the two companies easy to tell apart in the seeded data and the UI
  company.name = `${company.name} 02`

  return { company, address, companyAddress }
}
