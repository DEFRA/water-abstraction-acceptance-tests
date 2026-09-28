import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildChargeVersionEntity from '../entities/charge-version.entity.js'
import buildLicenceEntity from '../entities/licence.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import { formatDateToIso } from '../helpers/date.helpers.js'
import licenceScenario from './licence.scenario.js'
import licenceWithChargeVersionAndTwoPurposesScenario from './licence-with-charge-version-and-two-purposes.scenario.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regions } from '../default-values.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnSubmissionData from '../data/return-submission.data.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'
import { convertCubicMetresToMegalitres, splitTotalVolume } from '../helpers/conversion.helpers.js'

export const title = 'Licences for a two-part tariff review'
export const description =
  'Fourteen licences in one region, each with a TPT charge version and returns set up to raise a different two-part tariff review outcome, so a single two-part tariff bill run covers every review case'

// The first charge element covers April to October, leaving the remaining five months to the second
const FIRST_ELEMENT_MONTHS = 7

export default function () {
  const region = regions.SOUTH_WEST

  return mergeByKey(
    _twoCompletedReturnLogsLicence(region),
    _aggregateLicence(region),
    _lateReturnLogLicence(region),
    _nilReturnLicence(region),
    _completedNonTptReturnLogLicence(region),
    _twoOverAbstractedReturnsLicence(region),
    _returnStraddlingChargePeriodLicence(region),
    _receivedReturnLogLicence(region),
    _returnSplitOverRefsLicence(region),
    _returnStraddlingTwoElementsLicence(region),
    _returnLogUnderQueryLicence(region),
    _twoRefsAndTwoDueReturnsLicence(region),
    _unmatchedReturnLicence(region),
    _completedReturnLogLicence(region)
  )
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle, and a charge reference with an aggregate value
 *
 * @private
 */
function _aggregateLicence(region) {
  const licence = _completedReturnLogLicence(region)

  licence.chargeReference.adjustments.aggregate = '0.5'

  return licence
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed non-two-part-tariff
 * return log for the previous winter cycle
 *
 * @private
 */
function _completedNonTptReturnLogLicence(region) {
  const licence = _completedReturnLogLicence(region)

  const {
    returnLogs: [previousReturnLog, currentReturnLog],
    returnRequirement
  } = licence

  previousReturnLog.metadata.isTwoPartTariff = false
  currentReturnLog.metadata.isTwoPartTariff = false

  returnRequirement.twoPartTariff = false

  return licence
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle
 *
 * @private
 */
function _completedReturnLogLicence(region) {
  const licence = _dueReturnLogLicence(region)

  const {
    returnLogs: [previousReturnLog]
  } = licence

  previousReturnLog.status = 'completed'

  const totalVolume = licence.licenceVersionPurpose.annualQuantity

  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, totalVolume)

  return {
    ...licence,
    ...returnSubmissionEntity
  }
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a due return log for the
 * previous winter cycle
 *
 * @private
 */
function _dueReturnLogLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licenceEntity = buildLicenceEntity(region)
  const billingAccountEntity = buildBillingAccountEntity(licenceEntity, region)
  const chargeVersionEntity = buildChargeVersionEntity(licenceEntity, billingAccountEntity, region)
  const returnVersionEntity = buildReturnVersionEntity(licenceEntity)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const returnLogs = buildReturnLogs(
    licenceEntity.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licenceEntity.point,
    periods,
    region
  )

  return {
    ...licenceEntity,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...returnVersionEntity,
    returnLogs
  }
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle that was received after its due date
 *
 * @private
 */
function _lateReturnLogLicence(region) {
  const licence = _completedReturnLogLicence(region)

  const {
    returnLogs: [returnLog]
  } = licence

  const receivedDate = new Date(returnLog.dueDate)

  receivedDate.setUTCDate(receivedDate.getUTCDate() + 3)
  returnLog.receivedDate = formatDateToIso(receivedDate)

  return licence
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle that is a nil return
 *
 * @private
 */
function _nilReturnLicence(region) {
  const licence = _dueReturnLogLicence(region)

  const {
    returnLogs: [previousReturnLog]
  } = licence

  previousReturnLog.status = 'completed'

  const returnSubmission = returnSubmissionData(previousReturnLog)
  returnSubmission.nilReturn = true

  return {
    ...licence,
    returnSubmission
  }
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a return log for the previous
 * winter cycle with a status of "received"
 *
 * @private
 */
function _receivedReturnLogLicence(region) {
  const licence = _completedReturnLogLicence(region)

  const {
    returnLogs: [returnLog]
  } = licence

  returnLog.status = 'received'

  return licence
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle that is under query
 *
 * @private
 */
function _returnLogUnderQueryLicence(region) {
  const licence = _completedReturnLogLicence(region)

  const {
    returnLogs: [returnLog]
  } = licence

  returnLog.underQuery = true

  return licence
}

/**
 * Licence with a return version and a TPT charge version of two charge references, each with one charge element
 * sharing the same purpose but a different abstraction period, plus one completed return that matches and is split
 * across both references
 *
 * @private
 */
function _returnSplitOverRefsLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceScenario(region)

  // The single licence version purpose (400, Spray Irrigation - Direct) feeds both charge references, and its annual
  // quantity gives each reference a 32 ML volume.
  licence.licenceVersionPurpose.annualQuantity = 32000

  const billingAccount = billingAccountData(licence.company, region)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence, region)

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

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    licence.point,
    periods,
    region
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

/**
 * Licence with a return version and TPT charge version based on the licence data, plus a completed return log for the
 * previous winter cycle, with the charge version starting mid-April
 *
 * @private
 */
function _returnStraddlingChargePeriodLicence(region) {
  const licence = _completedReturnLogLicence(region)

  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffPeriod]
    }
  } = calculatedDates()

  const chargePeriodStartYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

  const { chargeVersion } = licence

  // Start the charge version mid-April so the charge period begins mid-month; the return's whole-month April line then
  // spans the charge period start, flagging an overlap of charge dates issue
  chargeVersion.startDate = `${chargePeriodStartYear}-04-15`

  return licence
}

/**
 * Licence with a return version and a TPT charge version made up of one charge reference with two charge elements
 * covering different parts of the year, plus a single completed return whose volume straddles and fully allocates to
 * both elements
 *
 * @private
 */
function _returnStraddlingTwoElementsLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = buildLicenceEntity(region)

  const { licenceVersionPurpose, point } = licence

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence, region)

  const { chargeReference, chargeElements } = _straddlingChargeReference(chargeVersion, licenceVersionPurpose)

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    point,
    periods,
    region
  )

  previousReturnLog.status = 'completed'

  // The return abstracts the licence's full authorised volume spread evenly across the year, so the seven months in
  // the first element's period allocate to it and the five months in the second element's period allocate to that,
  // filling both.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, licenceVersionPurpose.annualQuantity)

  return {
    ...licence,
    ...billingAccountEntity,
    chargeVersion,
    chargeReference,
    chargeElements,
    ...returnVersionEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}

/**
 * Licence with a return version and TPT charge version based on the licence data, plus two completed return logs for
 * the previous winter cycle, one TPT and one not
 *
 * @private
 */
function _twoCompletedReturnLogsLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithChargeVersionAndTwoPurposesScenario(region)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint, secondPoint] = licence.points

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the first return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousFirstReturnLog, currentFirstReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    periods,
    region
  )

  previousFirstReturnLog.status = 'completed'

  const secondReturnRequirement = _returnRequirement(
    returnVersionEntity.returnVersion,
    secondLicenceVersionPurpose,
    secondPoint
  )

  const [previousSecondReturnLog, currentSecondReturnLog] = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    periods,
    region
  )

  previousSecondReturnLog.status = 'completed'

  const firstReturnSubmissionEntity = buildReturnSubmissionEntity(
    previousFirstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondReturnSubmissionEntity = buildReturnSubmissionEntity(
    previousSecondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  return {
    ...licence,
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
 * Licence with a return version and a TPT charge version of one charge reference and two charge elements, plus two
 * completed returns for the previous winter cycle that are both over-abstracted, the second also abstracting outside
 * its own abstraction period
 *
 * @private
 */
function _twoOverAbstractedReturnsLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario(region)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint, secondPoint] = licence.points

  // Both purposes are two-part tariff (400 Spray Irrigation - Direct and 420 Spray Irrigation - Storage) so both charge
  // elements and both returns are two-part tariff. Keeping the purposes distinct lets each return match its own element.
  secondLicenceVersionPurpose.purposeId.value = '420'

  // The charge elements' authorised volumes (32 ML and 30 ML) and the charge reference volume derive from these annual
  // quantities, held in cubic metres.
  firstLicenceVersionPurpose.annualQuantity = 32000
  secondLicenceVersionPurpose.annualQuantity = 30000

  const billingAccount = billingAccountData(licence.company, region)
  const billingAccountAddress = billingAccountAddressData(billingAccount, licence.address)
  const chargeVersion = chargeVersionData(billingAccount, licence.licence, region)

  // One charge reference with two charge elements. The reference volume derives to 62 (32 + 30); we bump it to 64 so it
  // comfortably covers both elements and each allocates its full authorised volume.
  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurposes)
  chargeReference.volume = 64

  const firstChargeElement = chargeElementData(chargeReference, firstLicenceVersionPurpose)
  const secondChargeElement = chargeElementData(chargeReference, secondLicenceVersionPurpose)

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousFirstReturnLog, currentFirstReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    periods,
    region
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
    periods,
    region
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
 * Licence with a return version and a TPT charge version made up of two charge references, each with one charge
 * element, plus two due return logs for the previous winter cycle whose reference and element volumes are mismatched
 * so allocation caps at the lower of the two
 *
 * @private
 */
function _twoRefsAndTwoDueReturnsLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario(region)

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes
  firstLicenceVersionPurpose.annualQuantity = 4200
  secondLicenceVersionPurpose.annualQuantity = 4200

  const [firstPoint, secondPoint] = licence.points

  // Both purposes are two-part tariff (400 Spray Irrigation - Direct and 420 Spray Irrigation - Storage), so the
  // reference, element and return requirement builders all derive their two-part tariff flags. Keeping the purposes
  // distinct lets each return match its own element.
  secondLicenceVersionPurpose.purposeId.value = '420'

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence, region)

  const { chargeReferences, chargeElements } = _mismatchedChargeReferences(
    chargeVersion,
    firstLicenceVersionPurpose,
    secondLicenceVersionPurpose
  )

  const returnVersionEntity = buildReturnVersionEntity(licence)

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const firstReturnLogs = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    periods,
    region
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
    periods,
    region
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
 * Licence with a return version and a TPT charge version whose charge element and completed return have different
 * two-part tariff purposes, so the return cannot match the element
 *
 * @private
 */
function _unmatchedReturnLicence(region) {
  const { currentWinterReturnCycle } = calculatedDates()
  const periods = returnLogPeriods(currentWinterReturnCycle)

  const licence = licenceWithTwoPurposesScenario(region)

  const [elementPurpose, returnPurpose] = licence.licenceVersionPurposes
  const [, returnPoint] = licence.points

  // The charge element and the return use different two-part tariff purposes (400 Spray Irrigation - Direct and 420
  // Spray Irrigation - Storage), so the return cannot match the element and is left unmatched.
  returnPurpose.purposeId.value = '420'

  const billingAccountEntity = buildBillingAccountEntity(licence, region)
  const chargeVersionEntity = buildChargeVersionEntity(
    { ...licence, licenceVersionPurpose: elementPurpose },
    billingAccountEntity,
    region
  )

  const returnVersionEntity = buildReturnVersionEntity({
    ...licence,
    licenceVersionPurpose: returnPurpose,
    point: returnPoint
  })

  // In the service return logs will cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return log we're seeding.
  returnVersionEntity.returnVersion.startDate = periods[0].startDate

  const [previousReturnLog, currentReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    returnPoint,
    periods,
    region
  )

  previousReturnLog.status = 'completed'

  // The return submits its authorised quantity but has no charge element to allocate to, so it is left over-abstracted.
  const returnSubmissionEntity = buildReturnSubmissionEntity(previousReturnLog, returnPurpose.annualQuantity)

  return {
    ...licence,
    ...billingAccountEntity,
    ...chargeVersionEntity,
    ...returnVersionEntity,
    returnLogs: [previousReturnLog, currentReturnLog],
    ...returnSubmissionEntity
  }
}

/**
 * Totals a run of monthly volumes and converts the result to the megalitres a charge element is authorised in.
 *
 * @private
 */
function _elementVolume(monthlyVolumes) {
  const totalVolume = monthlyVolumes.reduce((total, monthlyVolume) => {
    return total + monthlyVolume
  }, 0)

  return convertCubicMetresToMegalitres(totalVolume)
}

/**
 * Builds two charge references, each with a single charge element, using mismatched reference/element volumes (22
 * and 42 swapped between them) so the engine always allocates up to the lower of the two
 *
 * @private
 */
function _mismatchedChargeReferences(chargeVersion, firstLicenceVersionPurpose, secondLicenceVersionPurpose) {
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

/**
 * Builds a charge reference with a charge factor, and two charge elements sharing its purpose but covering
 * different parts of the year, so a return spanning the whole year straddles and fully allocates to both
 *
 * @private
 */
function _straddlingChargeReference(chargeVersion, licenceVersionPurpose) {
  // The reference keeps a charge factor so the review page offers the "Change details" link we need to amend its
  // authorised volume.
  const chargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurpose])
  chargeReference.adjustments.charge = 1.5

  // Both elements share the reference's two-part tariff purpose but cover different parts of the year (April to October
  // and November to March). The return spreads the licence's authorised volume evenly across the twelve months, so we
  // split that volume the same way and authorise each element the share of the months its period covers. That way the
  // single return straddles both and fills each exactly.
  const monthlyVolumes = splitTotalVolume(licenceVersionPurpose.annualQuantity, 12)

  const firstChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  firstChargeElement.abstractionPeriodEndMonth = 10
  firstChargeElement.authorisedAnnualQuantity = _elementVolume(monthlyVolumes.slice(0, FIRST_ELEMENT_MONTHS))

  const secondChargeElement = chargeElementData(chargeReference, licenceVersionPurpose)
  secondChargeElement.abstractionPeriodStartMonth = 11
  secondChargeElement.authorisedAnnualQuantity = _elementVolume(monthlyVolumes.slice(FIRST_ELEMENT_MONTHS))

  return { chargeReference, chargeElements: [firstChargeElement, secondChargeElement] }
}
