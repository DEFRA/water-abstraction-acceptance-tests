import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with tpt charge version and two over-abstracted returns'
export const description =
  'Licence with a return version and a TPT charge version of one charge reference and two charge elements, plus two completed returns for the previous winter cycle that are both over-abstracted, the second also abstracting outside its own abstraction period'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario()

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint, secondPoint] = licence.points

  // Both purposes are two-part tariff (400 Spray Irrigation - Direct and 420 Spray Irrigation - Storage) so both charge
  // elements and both returns are two-part tariff. Keeping the purposes distinct lets each return match its own element.
  secondLicenceVersionPurpose.purposeId.value = '420'

  // The charge elements' authorised volumes (32 ML and 30 ML) and the charge reference volume derive from these annual
  // quantities, held in cubic metres.
  firstLicenceVersionPurpose.annualQuantity = 32000
  secondLicenceVersionPurpose.annualQuantity = 30000

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)

  // One charge reference with two charge elements. The reference volume derives to 62 (32 + 30); we bump it to 64 so it
  // comfortably covers both elements and each allocates its full authorised volume.
  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurposes)
  chargeReference.volume = 64

  const firstChargeElement = chargeElementData(chargeReference, firstLicenceVersionPurpose)
  const secondChargeElement = chargeElementData(chargeReference, secondLicenceVersionPurpose)

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, firstLicenceVersionPurpose, firstPoint)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousFirstReturnLog, currentFirstReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    periods
  )

  previousFirstReturnLog.status = 'completed'

  const secondReturnRequirement = _returnRequirement(
    returnVersionEntity.returnVersion,
    secondLicenceVersionPurpose,
    secondPoint
  )

  // Start the second return's abstraction period in May so its April submission volume falls outside it, flagging the
  // abstraction outside period issue on top of the over abstraction.
  secondReturnRequirement.returnRequirement.abstractionPeriodStartMonth = 5

  const [previousSecondReturnLog, currentSecondReturnLog] = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    periods
  )

  previousSecondReturnLog.status = 'completed'

  // Each return submits more than its element's authorised volume (38 > 32 and 36 > 30) so both are over-abstracted;
  // the engine still only allocates up to the authorised volume.
  const firstReturnSubmissionEntity = buildReturnSubmissionEntity(previousFirstReturnLog, 38000)
  const secondReturnSubmissionEntity = buildReturnSubmissionEntity(previousSecondReturnLog, 36000)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReference,
    chargeElements: [firstChargeElement, secondChargeElement],
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
    returnLogs: [previousFirstReturnLog, currentFirstReturnLog, previousSecondReturnLog, currentSecondReturnLog],
    returnSubmissions: [firstReturnSubmissionEntity.returnSubmission, secondReturnSubmissionEntity.returnSubmission],
    returnSubmissionLines: [
      ...firstReturnSubmissionEntity.returnSubmissionLines,
      ...secondReturnSubmissionEntity.returnSubmissionLines
    ]
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
