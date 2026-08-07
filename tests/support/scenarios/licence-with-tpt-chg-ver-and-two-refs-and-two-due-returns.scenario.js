import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with tpt charge version, two charge references and two due returns'
export const description =
  'Licence with a return version and a TPT charge version made up of two charge references, each with one charge element, plus two due return logs for the previous winter cycle whose reference and element volumes are mismatched so allocation caps at the lower of the two'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario()

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  firstLicenceVersionPurpose.annualQuantity = 4200
  secondLicenceVersionPurpose.annualQuantity = 4200

  const [firstPoint, secondPoint] = licence.points

  // Both purposes are two-part tariff (400 Spray Irrigation - Direct and 420 Spray Irrigation - Storage), so the
  // reference, element and return requirement builders all derive their two-part tariff flags. Keeping the purposes
  // distinct lets each return match its own element.
  secondLicenceVersionPurpose.purposeId.value = '420'

  const billingAccountEntity = buildBillingAccountEntity(licence.company, licence.address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence)

  const { chargeReferences, chargeElements } = _chargeReferences(
    chargeVersion,
    firstLicenceVersionPurpose,
    secondLicenceVersionPurpose
  )

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, firstLicenceVersionPurpose, firstPoint)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const firstReturnLogs = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    periods
  )

  const secondReturnRequirement = _returnRequirement(
    returnVersionEntity.returnVersion,
    secondLicenceVersionPurpose,
    secondPoint
  )

  const secondReturnLogs = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    periods
  )

  return {
    ...licence,
    ...billingAccountEntity,
    chargeVersion,
    chargeReferences,
    chargeElements,
    returnVersion: returnVersionEntity.returnVersion,
    returnRequirements: [returnVersionEntity.returnRequirement, secondReturnRequirement.returnRequirement],
    returnRequirementPoints: [
      returnVersionEntity.returnRequirementPoint,
      secondReturnRequirement.returnRequirementPoint
    ],
    returnRequirementPurposes: [
      returnVersionEntity.returnRequirementPurpose,
      secondReturnRequirement.returnRequirementPurpose
    ],
    returnLogs: [...firstReturnLogs, ...secondReturnLogs]
  }
}

/**
 * Builds two charge references, each with a single charge element, using mismatched reference/element volumes (22
 * and 42 swapped between them) so the engine always allocates up to the lower of the two
 *
 * @private
 */
function _chargeReferences(chargeVersion, firstLicenceVersionPurpose, secondLicenceVersionPurpose) {
  const firstChargeReference = chargeReferenceData(chargeVersion, [firstLicenceVersionPurpose])
  firstChargeReference.volume = 22

  const firstChargeElement = chargeElementData(firstChargeReference, firstLicenceVersionPurpose)
  firstChargeElement.authorisedAnnualQuantity = 42

  const secondChargeReference = chargeReferenceData(chargeVersion, [secondLicenceVersionPurpose])
  secondChargeReference.volume = 42

  const secondChargeElement = chargeElementData(secondChargeReference, secondLicenceVersionPurpose)
  secondChargeElement.authorisedAnnualQuantity = 22

  return {
    chargeReferences: [firstChargeReference, secondChargeReference],
    chargeElements: [firstChargeElement, secondChargeElement]
  }
}

/**
 * Builds a return requirement, point, and purpose against a shared return version
 *
 * @private
 */
function _returnRequirement(returnVersion, licenceVersionPurpose, point) {
  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return { returnRequirement, returnRequirementPoint, returnRequirementPurpose }
}
