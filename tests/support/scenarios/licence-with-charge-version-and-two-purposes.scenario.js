import buildBillingAccountEntity from 'water-abstraction-engine/cli/world/entities/billing-account.entity.js'
import chargeElementData from 'water-abstraction-engine/cli/world/data/charge-element.data.js'
import chargeReferenceData from 'water-abstraction-engine/cli/world/data/charge-reference.data.js'
import chargeVersionData from 'water-abstraction-engine/cli/world/data/charge-version.data.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'

import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with a charge version and two purposes'
export const description =
  'Licence with one charge version, one reference, two points, two licence version purposes, and two elements based on the licence data'

export default function (region) {
  if (!region) {
    region = regions.SOUTHERN
  }

  const licence = licenceWithTwoPurposesScenario(region)

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence, region)
  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurposes)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const firstChargeElement = chargeElementData(chargeReference, firstLicenceVersionPurpose)
  const secondChargeElement = chargeElementData(chargeReference, secondLicenceVersionPurpose)

  return {
    ...licence,
    ...billingAccountEntity,
    chargeVersion,
    chargeReference,
    chargeElements: [firstChargeElement, secondChargeElement]
  }
}
