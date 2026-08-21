import buildBillingAccountEntity from './billing-account.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'

/**
 * Builds a charge version in its entirety: a billing account and its address, the charge version itself, a charge
 * reference for the given licence version purpose, and a charge element — the minimum valid data a charge version
 * needs to exist against a licence.
 *
 * @param {object} company - the company the charge version's billing account belongs to
 * @param {object} address - the address linked to the charge version's billing account
 * @param {object} licence - the licence the charge version is for
 * @param {object} licenceVersionPurpose - the licence version purpose the charge reference is for
 */
export default function (company, address, licence, licenceVersionPurpose) {
  const billingAccountEntity = buildBillingAccountEntity(company, address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceVersionPurpose)

  return {
    ...billingAccountEntity,
    chargeVersion,
    chargeReference,
    chargeElement
  }
}
