import { generateAccountNumber, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (company) {
  const billingAccountId = generateUUID()
  const accountNumber = generateAccountNumber()

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
