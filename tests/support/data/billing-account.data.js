import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { accountNumber } from '../default-values.js'

export default function (company) {
  const billingAccountId = generateUUID()

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
