import billingAccountData from '../data/billing-account.data.js'
import billRunData from '../data/bill-run.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceWithAgreementScenario from './licence-with-agreement.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with an agreement and a bill run'
export const description =
  'A licence, licence holder (company), section 127 two-part tariff agreement, and a sent two-part tariff bill run.'

export default function () {
  const licenceAgreement = licenceWithAgreementScenario()

  // A charge version is required for the bill run to be a valid part of this scenario, even though it isn't called
  // out in the title/description.
  const billingAccount = billingAccountData(licenceAgreement)
  const chargeVersion = chargeVersionData(billingAccount, licenceAgreement)

  const chargeReference = chargeReferenceData(chargeVersion, licenceAgreement)
  const chargeElement = chargeElementData(chargeReference, licenceAgreement)

  const billRun = billRunData()

  return mergeByKey(licenceAgreement, billingAccount, chargeVersion, chargeReference, chargeElement, billRun)
}
