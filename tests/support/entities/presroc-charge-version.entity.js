import chargeReferenceData from '../data/charge-reference-presroc.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import buildBillingAccountEntity from './billing-account.entity.js'

/**
 * Builds a presroc (alcs scheme) charge version in its entirety: a billing account and its address, the charge
 * version itself, and a charge reference — the minimum valid data a charge version needs to exist against a presroc
 * licence.
 *
 * Unlike charge-version.entity.js, this doesn't build a charge element. The alcs scheme predates the sroc
 * reference/element split, so charge-reference-presroc.data.js already carries the abstraction period and
 * authorised quantity directly on the charge reference, where sroc would hold them on a separate charge element.
 * The modern billing engine also only processes charge versions on the sroc scheme, so there's no
 * charge-element-dependent transaction generation this data needs to satisfy either.
 */
export default function (company, address, licence, licenceVersionPurpose) {
  const billingAccountEntity = buildBillingAccountEntity(company, address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence)

  // charge-version.data.js hardcodes the scheme to sroc, so we override it to alcs to match the presroc start date
  chargeVersion.scheme = 'alcs'

  const chargeReference = chargeReferenceData(chargeVersion, licenceVersionPurpose)

  return {
    ...billingAccountEntity,
    chargeVersion,
    chargeReference
  }
}
