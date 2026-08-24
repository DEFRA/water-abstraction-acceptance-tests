import { asArrays } from '../helpers/wire-format.helpers.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

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

  // The acceptance tests app's tear-down service only cleans up water.points for a hardcoded set of external_ids
  // (9000031, 9000032, 9000090, 9000091) rather than relying solely on its relational delete, so a genuinely new
  // external_id here would be left behind after every run and collide with itself on the next.
  result.point.externalId = '9:9000032'
  result.licenceVersion.externalId = '9:1234:2:0'
  result.licenceVersionPurpose.externalId = '9:1235'
  result.billingAccount.accountNumber = 'S99999992A'

  return result
}
