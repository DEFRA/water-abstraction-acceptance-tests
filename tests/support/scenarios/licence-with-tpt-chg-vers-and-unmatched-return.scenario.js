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

export const title = 'Licence with tpt charge version and an unmatched return'
export const description =
  'Licence with a return version and a TPT charge version whose charge element and completed return have different two-part tariff purposes, so the return cannot match the element'

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

  const [elementPurpose, returnPurpose] = licence.licenceVersionPurposes
  const [, returnPoint] = licence.points

  // The charge element and the return use different two-part tariff purposes (400 Spray Irrigation - Direct and 420
  // Spray Irrigation - Storage), so the return cannot match the element and is left unmatched.
  returnPurpose.purposeId.value = '420'

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)

  const chargeReference = chargeReferenceData(chargeVersion, [elementPurpose])
  const chargeElement = chargeElementData(chargeReference, elementPurpose)

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const returnRequirement = returnRequirementData(returnVersion, returnPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, returnPoint)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, returnPurpose)

  const previousReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [returnPoint],
    previousPeriodDetails
  )
  const currentReturnLog = returnLogData(
    licence.licence,
    returnRequirement,
    [returnRequirementPurpose],
    [returnPoint],
    currentPeriodDetails
  )

  previousReturnLog.status = 'completed'

  // The return submits its authorised quantity but has no charge element to allocate to, so it is left over-abstracted.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, returnPurpose.annualQuantity)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReference,
    chargeElement,
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}
