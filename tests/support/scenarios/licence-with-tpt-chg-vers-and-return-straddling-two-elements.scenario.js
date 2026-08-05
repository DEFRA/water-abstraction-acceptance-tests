import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import returnLogData from '../data/return-log.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import returnSubmissionLinesData from '../data/return-submission-lines.data.js'
import returnVersionData from '../data/return-version.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and a return straddling two charge elements'
export const description =
  'Licence with a return version and a TPT charge version made up of one charge reference with two charge elements covering different parts of the year, plus a single completed return whose volume straddles and fully allocates to both elements'

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

  const licence = buildLicenceEntity()

  const { licenceVersionPurpose, point } = licence

  const billingAccountEntity = buildBillingAccountEntity(licence.company, licence.address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence)

  // A single charge reference holding two charge elements. It keeps a charge factor so the review page offers the
  // "Change details" link, and its authorised volume matches the combined authorised volume of the two elements.
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  chargeReference.volume = 60
  chargeReference.adjustments.charge = 1.5

  // Both elements share the reference's two-part tariff purpose but cover different halves of the year (April to
  // October and November to March), so the single return's monthly lines straddle them.
  const firstChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  firstChargeElement.abstractionPeriodEndMonth = 10
  firstChargeElement.authorisedAnnualQuantity = 35

  const secondChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  secondChargeElement.abstractionPeriodStartMonth = 11
  secondChargeElement.authorisedAnnualQuantity = 25

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  const previousReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    previousPeriodDetails
  )
  const currentReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [point],
    currentPeriodDetails
  )

  previousReturnLog.status = 'completed'

  // The return submits 60 ML spread evenly across the year (5 ML a month), so the seven months in the first element's
  // period allocate 35 ML to it and the five months in the second element's period allocate 25 ML, filling both.
  const returnSubmission = returnSubmissionData(previousReturnLog)
  const returnSubmissionLines = returnSubmissionLinesData(previousPeriodDetails, returnSubmission, 60000)

  return {
    ...licence,
    ...billingAccountEntity,
    chargeVersion,
    chargeReferences: [chargeReference],
    chargeElements: [firstChargeElement, secondChargeElement],
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLogs: [previousReturnLog, currentReturnLog],
    returnSubmission,
    returnSubmissionLines
  }
}
