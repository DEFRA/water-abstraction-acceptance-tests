import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import billRunData from '../data/bill-run.data.js'
import buildChargeVersionEntity from './charge-version.entity.js'
import { today } from '../helpers/date.helpers.js'
import transactionData from '../data/transaction.data.js'

// A bill can never be for £0 — a sent bill run always has a non-zero total, so the seeded bill and its transaction
// must share a real net amount (in pence) rather than being left null.
const netAmount = 6600

/**
 * Builds a bill run in its entirety: a charge version for the given licence, a sent bill run for the financial year
 * ending taken from the given billing period dates, and a bill, bill licence, and transaction for that charge
 * version's licence — the minimum valid data a bill run needs to exist against a licence.
 *
 * The bill run's batch type is left at the data file's default (annual). Scenarios needing a different batch type
 * must set `billRun.batchType` themselves.
 *
 * @param {object} licenceEntity - the licence entity the bill run's charge version and bill are for
 * @param {object} dates - the billing period dates; `dates.endDate` sets the bill run's financial year ending
 */
export default function (licenceEntity, dates) {
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity.company,
    licenceEntity.address,
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose
  )

  const billRun = billRunData()

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

  const bill = billData(chargeVersionEntity.billingAccount, billRun, netAmount)
  const billLicence = billLicenceData(bill, licenceEntity.licence)
  const transaction = transactionData(billLicence, chargeVersionEntity.chargeReference, dates, netAmount)

  return {
    ...chargeVersionEntity,
    billRun,
    bill,
    billLicence,
    transaction
  }
}
