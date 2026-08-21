import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import billRunData from '../data/bill-run.data.js'
import buildBillingAccountEntity from '../entities/billing-account.entity.js'
import buildReturnSubmissionEntity from '../entities/return-submission.entity.js'
import buildReturnVersionEntity from '../entities/return-version.entity.js'
import { calculatedDates } from '../helpers/calculated-dates.helpers.js'
import chargeElementData from '../data/charge-element.data.js'
import chargeReferenceData from '../data/charge-reference.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import { today } from '../helpers/date.helpers.js'
import transactionData from '../data/transaction.data.js'
import { buildReturnLogs, returnLogPeriods } from '../helpers/return-log.helpers.js'

export const title = 'Licence flagged for two-part tariff supplementary billing'
export const description =
  'Licence with a single charge version and charge reference, two two-part tariff charge elements, and two completed return logs matching them, plus a sent two-part tariff bill run for the same year and a licence supplementary year row flagging the licence for the next two-part tariff supplementary bill run'

const netAmount = 6600

export default function () {
  const {
    billingPeriods: {
      twoPartTariff: [twoPartTariffPeriod]
    }
  } = calculatedDates()

  const licence = licenceWithTwoPurposesScenario()

  const [firstLicenceVersionPurpose, secondLicenceVersionPurpose] = licence.licenceVersionPurposes

  // The scenario builder's second purpose defaults to 280 (Make-Up Or Top Up Water), which isn't two-part tariff. We
  // want both purposes, and so both charge elements and returns, to be two-part tariff.
  secondLicenceVersionPurpose.purposeId.value = '420'

  const [firstPoint, secondPoint] = licence.points

  const billingAccountEntity = buildBillingAccountEntity(licence.company, licence.address)
  const chargeVersion = chargeVersionData(billingAccountEntity.billingAccount, licence.licence)
  const chargeReference = chargeReferenceData(chargeVersion, licence.licenceVersionPurposes)

  const firstChargeElement = chargeElementData(chargeReference, firstLicenceVersionPurpose)
  const secondChargeElement = chargeElementData(chargeReference, secondLicenceVersionPurpose)

  const returnVersionEntity = buildReturnVersionEntity(licence.licence, firstLicenceVersionPurpose, firstPoint)

  // In the service return logs cover the whole period of their matching return version. To ensure our test data is
  // realistic, we alter the start date of the return version to match the return logs we're seeding.
  returnVersionEntity.returnVersion.startDate = twoPartTariffPeriod.startDate

  const [, currentPeriodDetails] = returnLogPeriods(twoPartTariffPeriod)

  const [firstReturnLog] = buildReturnLogs(
    licence.licence,
    returnVersionEntity.returnRequirement,
    returnVersionEntity.returnRequirementPurpose,
    firstPoint,
    [currentPeriodDetails]
  )

  // The return needs an actual submitted volume, not just a due return log, or the two-part tariff engine has
  // nothing to charge against and the resulting bill comes out as nil.
  firstReturnLog.status = 'completed'

  const secondReturnRequirement = _returnRequirement(
    returnVersionEntity.returnVersion,
    secondLicenceVersionPurpose,
    secondPoint
  )

  const [secondReturnLog] = buildReturnLogs(
    licence.licence,
    secondReturnRequirement.returnRequirement,
    secondReturnRequirement.returnRequirementPurpose,
    secondPoint,
    [currentPeriodDetails]
  )

  secondReturnLog.status = 'completed'

  const firstReturnSubmissionEntity = buildReturnSubmissionEntity(
    firstReturnLog,
    firstLicenceVersionPurpose.annualQuantity
  )
  const secondReturnSubmissionEntity = buildReturnSubmissionEntity(
    secondReturnLog,
    secondLicenceVersionPurpose.annualQuantity
  )

  const billRunResult = _billRun(
    licence.licence,
    billingAccountEntity.billingAccount,
    chargeReference,
    twoPartTariffPeriod
  )

  const licenceSupplementaryYear = {
    id: generateUUID(),
    licenceId: licence.licence.id,
    financialYearEnd: new Date(twoPartTariffPeriod.endDate).getUTCFullYear(),
    twoPartTariff: true
  }

  return {
    ...licence,
    ...billingAccountEntity,
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
    returnLogs: [firstReturnLog, secondReturnLog],
    returnSubmissions: [firstReturnSubmissionEntity.returnSubmission, secondReturnSubmissionEntity.returnSubmission],
    returnSubmissionLines: [
      ...firstReturnSubmissionEntity.returnSubmissionLines,
      ...secondReturnSubmissionEntity.returnSubmissionLines
    ],
    ...billRunResult,
    licenceSupplementaryYears: [licenceSupplementaryYear]
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
 * Builds a sent two-part tariff bill run for the given financial year, plus the bill, bill licence, and transaction
 * needed for it to be valid — this is what makes the licence's next two-part tariff bill run a supplementary one.
 *
 * @private
 */
function _billRun(licence, billingAccount, chargeReference, dates) {
  const billRun = billRunData()

  billRun.createdAt = today()
  billRun.batchType = 'two_part_tariff'
  billRun.fromFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()

  // The bill run page reads its totals straight off these columns rather than summing the bills linked to it, so
  // they must reflect the single non-credit bill this scenario seeds or the page shows blank/NaN totals.
  billRun.invoiceCount = 1
  billRun.creditNoteCount = 0
  billRun.invoiceValue = netAmount
  billRun.creditNoteValue = 0
  billRun.netTotal = netAmount

  const bill = billData(billingAccount, billRun, netAmount)
  const billLicence = billLicenceData(bill, licence)
  const transaction = transactionData(billLicence, chargeReference, dates, netAmount)

  return { billRun, bill, billLicence, transaction }
}
