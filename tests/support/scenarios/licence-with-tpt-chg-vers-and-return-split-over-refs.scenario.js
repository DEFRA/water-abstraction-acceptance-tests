import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'
import licenceScenario from './licence.scenario.js'

export const title = 'Licence with tpt charge version and a return split over two charge references'
export const description =
  'Licence with a return version and a TPT charge version of two charge references, each with one charge element sharing the same purpose but a different abstraction period, plus one completed return that matches and is split across both references'

export default function () {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceScenario()

  // The single licence version purpose (400, Spray Irrigation - Direct) feeds both charge references, and its annual
  // quantity gives each reference a 32 ML volume.
  licence.licenceVersionPurpose.annualQuantity = 32000

  const billingAccount = billingAccountData(licence.company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence)

  // Two charge references, each with one element on the same purpose but a different abstraction period, so the single
  // return matches (and is split across) both references. The reference volumes (32) leave the elements' authorised
  // volumes as the allocation cap.
  const firstChargeReference = chargeReferenceData(chargeVersion, [licence.licenceVersionPurpose])

  const firstChargeElement = chargeElementData(firstChargeReference, licence.licenceVersionPurpose)
  firstChargeElement.authorisedAnnualQuantity = 14
  // April to October
  firstChargeElement.abstractionPeriodStartMonth = 4
  firstChargeElement.abstractionPeriodEndMonth = 10

  const secondChargeReference = chargeReferenceData(chargeVersion, [licence.licenceVersionPurpose])
  // Give the second reference a different charge category and description so the two references are distinguishable
  secondChargeReference.chargeCategoryId.value = '4.6.19'
  secondChargeReference.description = 'Test charge reference 2'

  const secondChargeElement = chargeElementData(secondChargeReference, licence.licenceVersionPurpose)
  secondChargeElement.authorisedAnnualQuantity = 10
  // November to March
  secondChargeElement.abstractionPeriodStartMonth = 11
  secondChargeElement.abstractionPeriodEndMonth = 3

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, licence.licenceVersionPurpose, licence.point)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licence.point,
    periods
  )

  previousReturnLog.status = 'completed'

  // The return submits 24 ML spread evenly across the year (2 ML a month). The April to October element takes its seven
  // months (14 ML) and the November to March element its five months (10 ML), fully allocating the return across both.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, 24000)

  return {
    ...licence,
    billingAccount,
    billingAccountAddress,
    chargeVersion,
    chargeReferences: [firstChargeReference, secondChargeReference],
    chargeElements: [firstChargeElement, secondChargeElement],
    ...returnVersionEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}
