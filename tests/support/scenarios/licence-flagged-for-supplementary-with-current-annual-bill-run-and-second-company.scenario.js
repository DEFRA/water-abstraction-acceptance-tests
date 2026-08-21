import addressData from '../data/address.data.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import companyAddressData from '../data/company-address.data.js'
import companyData from '../data/company.data.js'
import licenceWithCurrentAnnualBillRunScenario from './licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { srocStartDate } from '../default-values.js'

export const title =
  'Licence flagged for supplementary billing with a sent annual bill run for the current year, plus a second company'
export const description =
  'The current-year annual bill run scenario, with its charge version starting on the sroc scheme start date so every outstanding sroc period has something to bill, plus a second company and address so a new charge version can move the billing account to it'

export default function () {
  const { billRun, ...licence } = licenceWithCurrentAnnualBillRunScenario()
  const secondCompany = _secondCompany()

  // Without this, both the licence and its charge version only cover the last year or so (their default start
  // dates), so there's nothing for a supplementary bill run to pick up in earlier sroc periods
  licence.licence.startDate = srocStartDate
  licence.licenceVersion.startDate = srocStartDate
  licence.licenceDocument.startDate = srocStartDate
  licence.licenceDocumentRole.startDate = srocStartDate
  licence.chargeVersion.startDate = srocStartDate

  return {
    ...mergeByKey(asArrays(licence), asArrays(secondCompany)),
    billRun
  }
}

/**
 * Builds a second company and address, unconnected to the licence, so a new charge version can move the billing
 * account to it
 *
 * @private
 */
function _secondCompany() {
  const company = companyData()
  const address = addressData()
  const companyAddress = companyAddressData(company, address)

  // Not required by the database, but makes the two companies easy to tell apart in the seeded data and the UI
  company.name = `${company.name} 02`

  return { company, address, companyAddress }
}
