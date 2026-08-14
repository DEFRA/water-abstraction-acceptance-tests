import { generateUUID } from '../helpers/generate-uuid.js'

export default function (billingAccount, billRun, netAmount) {
  return {
    id: generateUUID(),
    billingAccountId: billingAccount.id,
    address: {},
    accountNumber: billingAccount.accountNumber,
    billRunId: billRun.id,
    financialYearEnding: billRun.toFinancialYearEnding,
    netAmount,
    invoiceValue: netAmount,
    credit: false
  }
}
