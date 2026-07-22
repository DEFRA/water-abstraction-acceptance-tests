import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with a charge version'
export const description = 'Unregistered licence with one charge version based on the licence data'

export default function () {
  const unregisteredLicence = unregisteredLicenceScenario()

  const billingAccount = billingAccountData(unregisteredLicence)
  const chargeVersion = chargeVersionData(billingAccount, unregisteredLicence)
  const chargeReference = chargeReferenceData(chargeVersion, unregisteredLicence)

  return mergeByKey(unregisteredLicence, billingAccount, chargeVersion, chargeReference)
}
