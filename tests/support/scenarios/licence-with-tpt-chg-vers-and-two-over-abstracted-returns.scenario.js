import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and two over-abstracted returns'
export const description =
  'Licence with a return version and a TPT charge version of one charge reference and two charge elements, plus two completed returns for the previous winter cycle that are both over-abstracted, the second also abstracting outside its own abstraction period'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

  const previousPeriodDetails = previousPeriod({
    startDate: currentWinterReturnCycle.startDate,
    endDate: currentWinterReturnCycle.endDate,
    dueDate: null,
    quarterly: false
  })

  const currentPeriodDetails = {
    startDate: new Date(currentWinterReturnCycle.startDate),
    endDate: new Date(currentWinterReturnCycle.endDate),
    dueDate: null,
    quarterly: false
  }

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

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const firstReturnRequirement = returnRequirementData(returnVersion, firstLicenceVersionPurpose)
  const firstReturnRequirementPoint = returnRequirementPointData(firstReturnRequirement, firstPoint)
  const firstReturnRequirementPurpose = returnRequirementPurposeData(firstReturnRequirement, firstLicenceVersionPurpose)

  const secondReturnRequirement = returnRequirementData(returnVersion, secondLicenceVersionPurpose)
  // Start the second return's abstraction period in May so its April submission volume falls outside it, flagging the
  // abstraction outside period issue on top of the over abstraction.
  secondReturnRequirement.abstractionPeriodStartMonth = 5

  const secondReturnRequirementPoint = returnRequirementPointData(secondReturnRequirement, secondPoint)
  const secondReturnRequirementPurpose = returnRequirementPurposeData(
    secondReturnRequirement,
    secondLicenceVersionPurpose
  )

  const previousFirstReturnLog = returnLogData(
    licence.licence,
    firstReturnRequirement,
    [firstReturnRequirementPurpose],
    [firstPoint],
    previousPeriodDetails
  )
  const currentFirstReturnLog = returnLogData(
    licence.licence,
    firstReturnRequirement,
    [firstReturnRequirementPurpose],
    [firstPoint],
    currentPeriodDetails
  )

  previousFirstReturnLog.status = 'completed'

  const previousSecondReturnLog = returnLogData(
    licence.licence,
    secondReturnRequirement,
    [secondReturnRequirementPurpose],
    [secondPoint],
    previousPeriodDetails
  )
  const currentSecondReturnLog = returnLogData(
    licence.licence,
    secondReturnRequirement,
    [secondReturnRequirementPurpose],
    [secondPoint],
    currentPeriodDetails
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
    returnVersion,
    returnRequirements: [firstReturnRequirement, secondReturnRequirement],
    returnRequirementPoints: [firstReturnRequirementPoint, secondReturnRequirementPoint],
    returnRequirementPurposes: [firstReturnRequirementPurpose, secondReturnRequirementPurpose],
    returnLogs: [previousFirstReturnLog, currentFirstReturnLog, previousSecondReturnLog, currentSecondReturnLog],
    returnSubmissions: [firstReturnSubmissionEntity.returnSubmission, secondReturnSubmissionEntity.returnSubmission],
    returnSubmissionLines: [
      ...firstReturnSubmissionEntity.returnSubmissionLines,
      ...secondReturnSubmissionEntity.returnSubmissionLines
    ]
  }
}
