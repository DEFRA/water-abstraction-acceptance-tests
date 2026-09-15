import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import billRunData from '../data/bill-run.data.js'
import transactionData from '../data/transaction-presroc.data.js'
import { PRESROC_LAST_FINANCIAL_YEAR, previousYears, today } from '../helpers/date.helpers.js'

/**
 * Builds a presroc (alcs scheme) bill run in its entirety: a sent annual bill run for every financial year from
 * the presroc charge version's start date up to `PRESROC_LAST_FINANCIAL_YEAR` (the legacy engine is never
 * triggered beyond it), and a bill, bill licence, and transactions for the given charge version's licence — the
 * minimum valid data a presroc bill run needs to exist against a licence.
 *
 * Like bill-runs.entities.js, the array is returned with each entry's fields under their singular entity names,
 * ready to pass straight to `mergeByKey(...presrocBillRunEntities)`.
 *
 * @param {object} licenceEntity - the licence entity the bill licence is for
 * @param {object} billingAccountEntity - the billing account for the bill
 * @param {object} presrocChargeVersionEntity - the presroc charge version the bill and transactions are for
 * @param {object} dates - the current financial year's dates; capped down to `PRESROC_LAST_FINANCIAL_YEAR`
 * @param {object} region - the region
 */
export default function (licenceEntity, billingAccountEntity, presrocChargeVersionEntity, dates, region) {
  const presrocBillRunEntities = []

  const currentFYEndYear = new Date(dates.endDate).getUTCFullYear()
  const yearsBackToPresrocCap = Math.max(0, currentFYEndYear - PRESROC_LAST_FINANCIAL_YEAR)

  const presrocDates = {
    startDate: previousYears(dates.startDate, yearsBackToPresrocCap),
    endDate: previousYears(dates.endDate, yearsBackToPresrocCap)
  }

  const chargeVersionStartDate = new Date(presrocChargeVersionEntity.chargeVersion.startDate)
  const presrocCapStartDate = new Date(presrocDates.startDate)
  const yearsBack = Math.max(0, presrocCapStartDate.getFullYear() - chargeVersionStartDate.getFullYear())

  for (let offset = 0; offset <= yearsBack; offset++) {
    const fyPeriod = {
      startDate: previousYears(presrocDates.startDate, offset),
      endDate: previousYears(presrocDates.endDate, offset)
    }

    const billRunEntity = _billRunEntity(
      licenceEntity,
      billingAccountEntity,
      presrocChargeVersionEntity,
      fyPeriod,
      region
    )

    billRunEntity.billRun.createdAt = previousYears(today(), yearsBackToPresrocCap + offset)

    presrocBillRunEntities.push(billRunEntity)
  }

  return presrocBillRunEntities
}

function _billRunEntity(licenceEntity, billingAccountEntity, presrocChargeVersionEntity, dates, region) {
  const { licence } = licenceEntity
  const { billingAccount } = billingAccountEntity
  const { chargeReference } = presrocChargeVersionEntity

  const billRun = billRunData(region)

  billRun.scheme = 'alcs'
  billRun.createdAt = today()
  billRun.fromFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()

  const netAmount = _netAmount(billRun.toFinancialYearEnding, chargeReference.section127Agreement)
  const minimumChargeAmount = _minimumChargeAmount(billRun.toFinancialYearEnding)
  const totalNetAmount = netAmount + minimumChargeAmount

  billRun.invoiceCount = 1
  billRun.creditNoteCount = 0
  billRun.invoiceValue = totalNetAmount
  billRun.creditNoteValue = 0
  billRun.netTotal = totalNetAmount

  const bill = billData(billingAccount, billRun, totalNetAmount)
  const billLicence = billLicenceData(bill, licence)

  const transactions = [
    transactionData(billLicence, chargeReference, dates, netAmount),
    _minimumChargeTransaction(billLicence, minimumChargeAmount)
  ]

  _compensationCharge(licenceEntity, billLicence, presrocChargeVersionEntity, dates, transactions)

  return {
    billRun,
    bill,
    billLicence,
    transactions
  }
}

function _compensationCharge(licenceEntity, billLicence, presrocChargeVersionEntity, dates, transactions) {
  if (!licenceEntity.licence.waterUndertaker) {
    const compensationTransaction = transactionData(billLicence, presrocChargeVersionEntity.chargeReference, dates, 0)

    compensationTransaction.chargeType = 'compensation'
    compensationTransaction.description =
      'Compensation Charge calculated from all factors except Standard Unit Charge and Source (replaced by factors below) and excluding S127 Charge Element'

    transactions.push(compensationTransaction)
  }
}

function _minimumChargeAmount(chargeYear) {
  // Only FY2022 has been verified against real engine output (see the presroc-licence-flagged-for-supplementary
  // journey test) — extend as further presroc years are exercised against the real engine
  const chargeYearAmounts = {
    2022: 1006
  }

  return chargeYearAmounts[chargeYear]
}

function _minimumChargeTransaction(billLicence, netAmount) {
  return {
    id: generateUUID(),
    billLicenceId: billLicence.id,
    // TransactionHelper defaults chargeReferenceId to a random UUID and scheme to 'sroc' for any field we don't
    // set ourselves — both must be overridden here or the insert fails/mismatches the real alcs minimum charge row.
    // section126Factor/section130Agreement also need forcing to null — see transaction-presroc.data.js
    chargeReferenceId: null,
    scheme: 'alcs',
    section126Factor: null,
    section130Agreement: null,
    chargeType: 'minimum_charge',
    description: 'Minimum Charge Calculation - raised under Schedule 23 of the Environment Act 1995',
    netAmount,
    credit: false
  }
}

function _netAmount(chargeYear, twoPartTariff) {
  // Only FY2022 has been verified against real engine output (see the presroc-licence-flagged-for-supplementary
  // journey test) — extend as further presroc years are exercised against the real engine
  const chargeYearAmounts = {
    2022: 2988
  }

  const amount = chargeYearAmounts[chargeYear]

  if (twoPartTariff) {
    return amount / 2
  }

  return amount
}
