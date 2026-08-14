import { generateTestAccountNumber } from '../helpers/generate-test-ref.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (company) {
  const billingAccountId = generateUUID()

  return {
    id: billingAccountId,
    accountNumber: generateTestAccountNumber(),
    companyId: company.id
  }
}
