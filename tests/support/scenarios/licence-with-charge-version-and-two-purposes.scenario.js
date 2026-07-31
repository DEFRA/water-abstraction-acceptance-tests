import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with a charge version and two purposes'
export const description =
  'Licence with one charge version, one reference, two points, two licence version purposes, and two elements based on the licence data'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)
  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurposes)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const firstChargeElement = chargeElementData(chargeReference, firstLicenceVersionPurpose)
  const secondChargeElement = chargeElementData(chargeReference, secondLicenceVersionPurpose)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReference,
    chargeElements: [firstChargeElement, secondChargeElement]
  }
}
