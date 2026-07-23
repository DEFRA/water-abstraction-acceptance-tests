import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a charge version and two purposes'
export const description =
  'Licence with one charge version, one reference, two points, two licence version purposes, and two elements based on the licence data'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const billingAccount = billingAccountData(licence)
  const chargeVersion = chargeVersionData(billingAccount, licence)
  const chargeReference = chargeReferenceData(chargeVersion, licence)

  return mergeByKey(licence, billingAccount, chargeVersion, chargeReference)
}
