import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeReferenceData from '../data/charge-reference-presroc.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import presrocLicenceScenario from './presroc-licence.scenario.js'

export const title = 'Presroc licence with a charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = presrocLicenceScenario()

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)

  // charge-version.data.js hardcodes the scheme to sroc, so we override it to alcs to match the presroc start date
  chargeVersion.scheme = 'alcs'

  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurpose)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReference
  }
}
