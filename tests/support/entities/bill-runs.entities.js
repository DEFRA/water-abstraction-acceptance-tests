import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import billRunData from '../data/bill-run.data.js'
import transactionData from '../data/transaction.data.js'
import { previousYears, today } from '../helpers/date.helpers.js'

// A bill can never be for £0 — a sent bill run always has a non-zero total, so the seeded bill and its transaction
// must share a real net amount (in pence) rather than being left null.
const netAmount = 5335

/**
 * Builds a bill run in its entirety: a sent bill run for the financial year ending taken from the given billing
 * period dates, and a bill, bill licence, and transaction for the given charge version's licence — the minimum
 * valid data a bill run needs to exist against a licence.
 *
 * The bill run's batch type is left at the data file's default (annual). Scenarios needing a different batch type
 * must set it themselves on every entry in the returned array, e.g. `billRunEntities[0].billRun.batchType`.
 *
 * The array is returned with each entry's fields under their singular entity names (`billRun`, `bill`, ...), like
 * any other entity file — pass it straight to `mergeByKey(...billRunEntities)`, which normalizes each entry to the
 * seed endpoint's pluralized wire format itself.
 *
 * @param {object} licenceEntity - the licence entity the bill licence is for
 * @param {object} billingAccountEntity - the billing account for the bill
 * @param {object} chargeVersionEntity - the charge version the bill and transaction are for
 * @param {object} dates - the billing period dates; `dates.endDate` sets the bill run's financial year ending
 * @param {object} region - the region
 */
export default function (licenceEntity, billingAccountEntity, chargeVersionEntity, dates, region) {
  const billRunEntities = []

  // Determine how many years back the charge version goes relative to current financial year
  const chargeVersionStartDate = new Date(chargeVersionEntity.chargeVersion.startDate)
  const currentFYStartDate = new Date(dates.startDate)
  const yearsBack = Math.max(0, currentFYStartDate.getFullYear() - chargeVersionStartDate.getFullYear())

  for (let offset = 0; offset <= yearsBack; offset++) {
    const fyPeriod = {
      startDate: previousYears(dates.startDate, offset),
      endDate: previousYears(dates.endDate, offset)
    }

    // net amount + invoice - need to use a lookup for the year for chargering bulling -= e.g £48.50 for x

    const billRunEntity = _billRunEntity(licenceEntity, billingAccountEntity, chargeVersionEntity, fyPeriod, region)

    if (offset > 0) {
      billRunEntity.billRun.createdAt = previousYears(today(), offset)
    }

    billRunEntities.push(billRunEntity)
  }

  return billRunEntities
}

function _billRunEntity(licenceEntity, billingAccountEntity, chargeVersionEntity, dates, region) {
  const { licence } = licenceEntity
  const { billingAccount } = billingAccountEntity
  const { chargeReference } = chargeVersionEntity

  const billRun = billRunData(region)

  billRun.createdAt = today()
  billRun.fromFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()
  billRun.toFinancialYearEnding = new Date(dates.endDate).getUTCFullYear()

  // The bill run page reads its totals straight off these columns rather than summing the bills linked to it, so
  // they must reflect the single non-credit bill this entity seeds or the page shows blank/NaN totals.
  billRun.invoiceCount = 1
  billRun.creditNoteCount = 0
  billRun.invoiceValue = netAmount
  billRun.creditNoteValue = 0
  billRun.netTotal = netAmount

  const bill = billData(billingAccount, billRun, netAmount)
  const billLicence = billLicenceData(bill, licence)

  const transactions = [transactionData(billLicence, chargeReference, dates, netAmount)]

  _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions)

  return {
    billRun,
    bill,
    billLicence,
    transactions
  }
}

function _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions) {
  if (!licenceEntity.licence.waterUndertaker) {
    const transaction2 = transactionData(billLicence, chargeVersionEntity.chargeReference, dates, netAmount)

    transaction2.chargeType = 'compensation'
    transaction2.netAmount = 0
    transaction2.description =
      'Compensation charge: calculated from the charge reference, activity description and regional environmental improvement charge; excludes any supported source additional charge and two-part tariff charge agreement'

    transactions.push(transaction2)
  }
}
