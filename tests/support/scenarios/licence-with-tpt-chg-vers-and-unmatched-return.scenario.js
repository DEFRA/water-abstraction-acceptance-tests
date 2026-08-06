import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import buildReturnRequirementEntity from '../entities/return-requirement.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { buildReturnLogs } from '../helpers/return-log.helpers.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with tpt charge version and an unmatched return'
export const description =
  'Licence with a return version and a TPT charge version whose charge element and completed return have different two-part tariff purposes, so the return cannot match the element'

export default function (calculatedDates) {
  const { currentWinterReturnCycle } = calculatedDates

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

  const returnRequirementEntity = buildReturnRequirementEntity(licence.licence, returnPurpose, returnPoint)

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnRequirementEntity.returnRequirement,
    returnRequirementEntity.returnRequirementPurpose,
    returnPoint,
    currentWinterReturnCycle
  )

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnRequirementEntity.returnVersion.startDate = previousReturnLog.startDate

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
    ...returnRequirementEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}
