import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { regions } from '../default-values.js'

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
