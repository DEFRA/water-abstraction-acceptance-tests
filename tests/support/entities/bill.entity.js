import billData from '../data/bill.data.js'
import billLicenceData from '../data/bill-licence.data.js'
import transactionData from '../data/transaction.data.js'
import { transactionTotals } from '../helpers/billing.helpers.js'

/**
 * Builds a bill in its entirety: the bill itself for the given bill run, a bill licence for the licence, and its
 * transactions, with the bill's totals calculated from them — the minimum valid data a bill needs to exist in a
 * bill run.
 *
 * The bill run's own totals are not updated here, as a bill run can hold many bills; the caller totals the bill run
 * once all its bills are built.
 *
 * @param {object} billRun - the bill run the bill belongs to
 * @param {object} licenceEntity - the licence entity the bill licence is for
 * @param {object} billingAccountEntity - the billing account for the bill
 * @param {object} chargeVersionEntity - the charge version the transactions are for
 * @param {object} dates - the billing period the transactions cover
 * @param {object} region - the region
 */
export default function (billRun, licenceEntity, billingAccountEntity, chargeVersionEntity, dates, region) {
  const { licence } = licenceEntity
  const { billingAccount } = billingAccountEntity
  const { chargeReference } = chargeVersionEntity

  const bill = billData(billingAccount, billRun, region)
  const billLicence = billLicenceData(bill, licence)

  const transactions = [transactionData(billLicence, chargeReference, dates)]

  _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions)

  const { creditNoteValue, invoiceValue, netAmount } = transactionTotals(transactions)

  bill.netAmount = netAmount
  bill.creditNoteValue = creditNoteValue
  bill.invoiceValue = invoiceValue

  return {
    bill,
    billLicence,
    transactions
  }
}

function _compensationCharge(licenceEntity, billLicence, chargeVersionEntity, dates, transactions) {
  if (!licenceEntity.licence.waterUndertaker) {
    const compensationTransaction = transactionData(billLicence, chargeVersionEntity.chargeReference, dates)

    compensationTransaction.chargeType = 'compensation'
    compensationTransaction.netAmount = 0
    compensationTransaction.description =
      'Compensation charge: calculated from the charge reference, activity description and regional environmental improvement charge; excludes any supported source additional charge and two-part tariff charge agreement'

    transactions.push(compensationTransaction)
  }
}
