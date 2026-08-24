import {
  generateAccountNumber,
  generateLicenceVersionExternalId,
  generateLicenceVersionPurposeExternalId
} from 'water-abstraction-engine/test/generators.js'

import { asArrays } from '../helpers/wire-format.helpers.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { generatePointExternalId } from '../helpers/generators.helpers.js'

export const title = 'Two licences, with different billing accounts'
export const description =
  'Two separate licences, each with a charge version and billing account, so an annual bill run picks up more than one bill'

export default function () {
  const firstLicence = licenceWithChargeVersionScenario()
  const secondLicence = _secondLicenceWithChargeVersion()

  return mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
}

/**
 * Builds the second licence and its charge version
 *
 * The point, licence version, licence version purpose and billing account each carry a fixed NALD-derived
 * identifier that's unique per record in the database, so building a second licence means giving each its own
 * value to avoid colliding with the first. The company name is also suffixed so that anyone reading the seeded
 * data or the app's UI can tell the two licences apart at a glance, though this isn't required by the database.
 *
 * @private
 */
function _secondLicenceWithChargeVersion() {
  const result = licenceWithChargeVersionScenario()

  // Not required by the database, but makes the two licences easy to tell apart in the seeded data and the UI. If
  // you were to go to the companies page, you might expect both licences to merge into one row if they had the
  // same name, but that's not the case - the company id is different, so duplicate company names are possible.
  result.company.name = `${result.company.name} 02`

  // TODO: maybe this ?
  delete result.company.externalId

  result.point.externalId = generatePointExternalId()
  result.licenceVersion.externalId = generateLicenceVersionExternalId()
  result.licenceVersionPurpose.externalId = generateLicenceVersionPurposeExternalId()
  result.billingAccount.accountNumber = generateAccountNumber()

  return result
}
