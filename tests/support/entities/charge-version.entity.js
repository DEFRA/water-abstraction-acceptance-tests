import buildBillingAccountEntity from './billing-account.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'

/**
 * Builds a charge version in its entirety: a billing account and its address, the charge version itself, a charge
 * reference for the given licence version purpose, and a charge element — the minimum valid data a charge version
 * needs to exist against a licence.
 *
 * @param {object} licenceEntity - the licence entity the charge version is for
 * @param {object} region - the region the charge version and its billing account are for
 */
export default function (licenceEntity, region) {
  const { company, address, licence, licenceVersionPurpose } = licenceEntity

  const billingAccountEntity = buildBillingAccountEntity(company, address, region)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence, region)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceVersionPurpose)

  return {
    ...billingAccountEntity,
    chargeVersion,
    chargeReference,
    chargeElement
  }
}
