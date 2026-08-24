import {
  generateLicenceVersionExternalId,
  generateLicenceVersionPurposeExternalId
} from 'water-abstraction-engine/test/generators.js'

import { asArrays } from '../helpers/wire-format.helpers.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { generatePointExternalId } from '../helpers/generators.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Two licences on the same billing account'
export const description =
  'Two separate licences, both billed to the same billing account, so an annual bill run creates a single bill covering both'

export default function () {
  const firstLicence = _licenceWithChargeVersion()
  const secondLicence = _secondLicenceSharingBillingAccount(firstLicence)

  return mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
}

/**
 * Builds a licence and its charge version
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

  return { ...licenceEntity, ...chargeVersionEntity }
}

/**
 * Builds the second licence and its charge version, billed to the first licence's billing account
 *
 * Unlike a typical second licence, this one doesn't build its own billing account - its charge version references
 * the billing account passed in, so the two licences end up sharing a single bill between them. It's also billed
 * to the same company as the first licence, since a shared billing account implies a shared licence holder, so
 * its own generated company is discarded rather than seeded as a second, unused record.
 *
 * @private
 */
function _secondLicenceSharingBillingAccount(firstLicence) {
  const { billingAccount, company } = firstLicence

  const licenceEntity = buildLicenceEntity()
  const chargeVersion = chargeVersionData(billingAccount, licenceEntity.licence)
  const chargeReference = chargeReferenceData(chargeVersion, [licenceEntity.licenceVersionPurpose])
  const chargeElement = chargeElementData(chargeReference, licenceEntity.licenceVersionPurpose)

  // The licence's own company and companyAddress (built by buildLicenceEntity) are discarded rather than reused,
  // since the licence holder here is firstLicence's company - reusing them would either duplicate that company's
  // row or leave licenceDocumentRole/licenceVersion pointing at a company that's no longer part of the payload.
  delete licenceEntity.company
  delete licenceEntity.companyAddress

  licenceEntity.licenceDocumentRole.companyId = company.id
  licenceEntity.licenceVersion.companyId = company.id

  licenceEntity.point.externalId = generatePointExternalId()
  licenceEntity.licenceVersion.externalId = generateLicenceVersionExternalId()
  licenceEntity.licenceVersionPurpose.externalId = generateLicenceVersionPurposeExternalId()

  return { ...licenceEntity, chargeVersion, chargeReference, chargeElement }
}
