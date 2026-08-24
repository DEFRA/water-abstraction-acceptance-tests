import {
  generateLicenceVersionExternalId,
  generateLicenceVersionPurposeExternalId
} from 'water-abstraction-engine/test/generators.js'

import { asArrays } from '../helpers/wire-format.helpers.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { generateAccountNumber, generatePointExternalId } from '../helpers/generators.helpers.js'

export const title = 'A licence and a water company licence'
export const description = 'A licence and a water company licence, each with a charge version and billing account'

export default function () {
  const firstLicence = licenceWithChargeVersionScenario()
  const secondLicence = _waterCompanyLicenceWithChargeVersion()

  return mergeByKey(asArrays(firstLicence), asArrays(secondLicence))
}

/**
 * Builds the second licence and its charge version, flagged as a water company
 *
 * The point, licence version, licence version purpose and billing account each carry a fixed NALD-derived
 * identifier that's unique per record in the database, so building a second licence means giving each its own
 * value to avoid colliding with the first. The company name is also suffixed so that anyone reading the seeded
 * data or the app's UI can tell the two licences apart at a glance, though this isn't required by the database.
 *
 * @private
 */
function _waterCompanyLicenceWithChargeVersion() {
  const result = licenceWithChargeVersionScenario()

  result.licence.waterUndertaker = true
  result.company.name = `${result.company.name} 02`

  result.point.externalId = generatePointExternalId()
  result.licenceVersion.externalId = generateLicenceVersionExternalId()
  result.licenceVersionPurpose.externalId = generateLicenceVersionPurposeExternalId()
  result.billingAccount.accountNumber = generateAccountNumber()

  return result
}
