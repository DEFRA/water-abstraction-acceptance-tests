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
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { previousPeriod } from '../helpers/date.helpers.js'

export const title = 'Licence with tpt charge version and two due returns'
export const description =
  'Licence with a return version and a TPT charge version made up of two charge references, each with one charge element, plus two due return logs for the previous winter cycle whose reference and element volumes are mismatched so allocation caps at the lower of the two'

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

  // Both purposes are two-part tariff (400 Spray Irrigation - Direct and 420 Spray Irrigation - Storage), so the
  // reference, element and return requirement builders all derive their two-part tariff flags. Keeping the purposes
  // distinct lets each return match its own element.
  secondLicenceVersionPurpose.purposeId.value = '420'

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)

  // Two separate charge references, each with a single charge element. The reference and element volumes are
  // deliberately mismatched (and swapped between the two) so we can prove the engine allocates only up to the lower of
  // the reference volume and the element's authorised volume.
  const firstChargeReference = chargeReferenceData(chargeVersion, [firstLicenceVersionPurpose])
  firstChargeReference.volume = 22

  const firstChargeElement = chargeElementData(firstChargeReference, firstLicenceVersionPurpose)
  firstChargeElement.authorisedAnnualQuantity = 42

  const secondChargeReference = chargeReferenceData(chargeVersion, [secondLicenceVersionPurpose])
  secondChargeReference.volume = 52

  const secondChargeElement = chargeElementData(secondChargeReference, secondLicenceVersionPurpose)
  secondChargeElement.authorisedAnnualQuantity = 32

  const returnVersion = returnVersionData(licence.licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersion.startDate = previousPeriodDetails.startDate

  const firstReturnRequirement = returnRequirementData(returnVersion, firstLicenceVersionPurpose)
  const firstReturnRequirementPoint = returnRequirementPointData(firstReturnRequirement, firstPoint)
  const firstReturnRequirementPurpose = returnRequirementPurposeData(firstReturnRequirement, firstLicenceVersionPurpose)

  const secondReturnRequirement = returnRequirementData(returnVersion, secondLicenceVersionPurpose)
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

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReferences: [firstChargeReference, secondChargeReference],
    chargeElements: [firstChargeElement, secondChargeElement],
    returnVersion,
    returnRequirements: [firstReturnRequirement, secondReturnRequirement],
    returnRequirementPoints: [firstReturnRequirementPoint, secondReturnRequirementPoint],
    returnRequirementPurposes: [firstReturnRequirementPurpose, secondReturnRequirementPurpose],
    returnLogs: [previousFirstReturnLog, currentFirstReturnLog, previousSecondReturnLog, currentSecondReturnLog]
  }
}
