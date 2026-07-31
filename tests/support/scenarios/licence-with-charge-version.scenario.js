import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceScenario from './licence.scenario.js'

export const title = 'Licence with a charge version'
export const description = 'Licence with one charge version, reference and element based on the licence data'

export default function () {
  const licence = licenceScenario()

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)
  const chargeReference = chargeReferenceData(chargeVersion, [licence.licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licence.licenceVersionPurpose)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReference,
    chargeElement
  }
}
