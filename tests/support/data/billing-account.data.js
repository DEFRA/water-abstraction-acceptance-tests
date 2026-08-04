import { accountNumber } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (company) {
  const billingAccountId = generateUUID()

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
