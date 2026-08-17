import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { licenceRef } from '../default-values.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'

export const title = 'Two licences on the same billing account'
export const description =
  'Two separate licences, both billed to the same billing account, so an annual bill run creates a single bill covering both'

export default function () {
  const firstLicence = _licenceWithChargeVersion(licenceRef)
  const secondLicence = _secondLicenceSharingBillingAccount(`${licenceRef.slice(0, -2)}03`, firstLicence.billingAccount)

  return mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
}

/**
 * Builds a licence and its charge version
 *
 * @private
 */
function _licenceWithChargeVersion(ref) {
  const licenceEntity = buildLicenceEntity(ref)
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  return { ...licenceEntity, ...chargeVersionEntity }
}

/**
 * Builds the second licence and its charge version, billed to the first licence's billing account
 *
 * Unlike a typical second licence, this one doesn't build its own billing account - its charge version references
 * the billing account passed in, so the two licences end up sharing a single bill between them.
 *
 * @private
 */
function _secondLicenceSharingBillingAccount(ref, billingAccount) {
  const licenceEntity = buildLicenceEntity(ref)
  const chargeVersion = chargeVersionData(billingAccount, licenceEntity.licence)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceEntity.licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceEntity.licenceVersionPurpose)

  licenceEntity.company.name = `${licenceEntity.company.name} 03`

  licenceEntity.point.externalId = '9:9000094'
  licenceEntity.licenceVersion.externalId = '9:1234:3:0'
  licenceEntity.licenceVersionPurpose.externalId = '9:1236'

  return { ...licenceEntity, chargeVersion, chargeReference, chargeElement }
}
