import {
  generateAccountNumber,
  generateLicenceVersionExternalId,
  generateLicenceVersionPurposeExternalId,
  generatePointExternalId
} from 'water-abstraction-engine/test/generators.js'

import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'

export const title = 'A licence and a water company licence'
export const description = 'A licence and a water company licence, each with a charge version and billing account'

export default function () {
  const region = regions.MIDLANDS

  const firstLicence = licenceWithChargeVersionScenario(region)
  const secondLicence = _waterCompanyLicenceWithChargeVersion(region)

  return mergeByKey(firstLicence, secondLicence)
}

/**
 * Builds the second licence and its charge version, flagged as a water company
 *
 * The point, licence version, licence version purpose and billing account each carry a fixed NALD-derived
 * identifier that's unique per record in the database, so building a second licence means giving each its own
 * value to avoid colliding with the first.
 *
 * @private
 */
function _waterCompanyLicenceWithChargeVersion(region) {
  const result = licenceWithChargeVersionScenario(region)

  result.licence.waterUndertaker = true

  result.point.externalId = generatePointExternalId(region)
  result.licenceVersion.externalId = generateLicenceVersionExternalId(region)
  result.licenceVersionPurpose.externalId = generateLicenceVersionPurposeExternalId(region)
  result.billingAccount.accountNumber = generateAccountNumber(region.chargeRegionId)

  return result
}
