import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { asArrays } from '../helpers/wire-format.helpers.js'

export const title = 'Two water company licences, each with a charge version'
export const description =
  'Two separate water company licences, each with a charge version, so an annual bill run picks up more than one bill'

export default function () {
  const firstLicence = _licenceWithChargeVersion()
  const secondLicence = _secondLicenceWithChargeVersion()

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
 * Builds the second water company licence and its charge version
 *
 * The company name is suffixed so that anyone reading the seeded data or the app's UI can tell the two licences
 * apart at a glance, though this isn't required by the database.
 *
 * @private
 */
function _secondLicenceWithChargeVersion() {
  const result = _licenceWithChargeVersion()

  // Not required by the database, but makes the two licences easy to tell apart in the seeded data and the UI. If
  // you were to go to the companies page, you might expect both licences to merge into one row if they had the
  // same name, but that's not the case - the company id is different, so duplicate company names are possible.
  result.company.name = `${result.company.name} 02`

  return result
}
