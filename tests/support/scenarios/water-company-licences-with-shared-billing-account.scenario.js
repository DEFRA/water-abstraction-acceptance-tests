import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'

export const title = 'Two water company licences on the same billing account'
export const description =
  'Two separate water company licences, both billed to the same billing account, so an annual bill run creates a single bill covering both'

export default function () {
  const firstLicence = _licenceWithChargeVersion()
  const secondLicence = _secondLicenceSharingBillingAccount(firstLicence.billingAccount)

  return mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
}

/**
 * Builds a water company licence and its charge version
 *
 * @private
 */
function _licenceWithChargeVersion() {
  const licenceEntity = buildLicenceEntity()
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  licenceEntity.licence.waterUndertaker = true

  return { ...licenceEntity, ...chargeVersionEntity }
}

/**
 * Builds the second water company licence and its charge version, billed to the first licence's billing account
 *
 * Unlike a typical second licence, this one doesn't build its own billing account - its charge version references
 * the billing account passed in, so the two licences end up sharing a single bill between them.
 *
 * @private
 */
function _secondLicenceSharingBillingAccount(billingAccount) {
  const licenceEntity = buildLicenceEntity()
  const chargeVersion = chargeVersionData(billingAccount, licenceEntity.licence)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceEntity.licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceEntity.licenceVersionPurpose)

  licenceEntity.licence.waterUndertaker = true
  licenceEntity.company.name = `${licenceEntity.company.name} 03`

  licenceEntity.point.externalId = '9:9000094'
  licenceEntity.licenceVersion.externalId = '9:1234:3:0'
  licenceEntity.licenceVersionPurpose.externalId = '9:1236'

  return { ...licenceEntity, chargeVersion, chargeReference, chargeElement }
}
