import { generateInvoiceNumber, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (billingAccount, billRun, region) {
  return {
    id: generateUUID(),
    billingAccountId: billingAccount.id,
    address: {},
    accountNumber: billingAccount.accountNumber,
    invoiceNumber: generateInvoiceNumber(region),
    billRunId: billRun.id,
    financialYearEnding: billRun.toFinancialYearEnding,
    netAmount: 0,
    invoiceValue: 0,
    creditNoteValue: 0,
    credit: false
  }
}
