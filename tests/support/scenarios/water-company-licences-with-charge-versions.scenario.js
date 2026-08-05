import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { asArrays } from '../helpers/wire-format.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { licenceRef } from '../default-values.js'

export const title = 'Two water company licences, each with a charge version'
export const description =
  'Two separate water company licences, each with a charge version, so an annual bill run picks up more than one bill'

export default function () {
  const first = _licenceWithChargeVersion(licenceRef)
  const second = _secondLicenceWithChargeVersion(`${licenceRef.slice(0, -2)}02`)

  return mergeByKey(asArrays(first), asArrays(second))
}

/**
 * Builds a water company licence and its charge version
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

  licenceEntity.licence.waterUndertaker = true

  return { ...licenceEntity, ...chargeVersionEntity }
}

/**
 * Builds the second water company licence and its charge version
 *
 * The point, licence version, licence version purpose and billing account each carry a fixed NALD-derived
 * identifier that's unique per record in the database, so building a second licence means giving each its own
 * value to avoid colliding with the first. The company name is also suffixed so that anyone reading the seeded
 * data or the app's UI can tell the two licences apart at a glance, though this isn't required by the database.
 *
 * @private
 */
function _secondLicenceWithChargeVersion(ref) {
  const result = _licenceWithChargeVersion(ref)

  // Not required by the database, but makes the two licences easy to tell apart in the seeded data and the UI. If
  // you were to go to the companies page, you might expect both licences to merge into one row if they had the
  // same name, but that's not the case - the company id is different, so duplicate company names are possible.
  result.company.name = `${result.company.name} 02`

  result.point.externalId = '9:9000093'
  result.licenceVersion.externalId = '9:1234:2:0'
  result.licenceVersionPurpose.externalId = '9:1235'
  result.billingAccount.accountNumber = 'S99999992A'

  return result
}
