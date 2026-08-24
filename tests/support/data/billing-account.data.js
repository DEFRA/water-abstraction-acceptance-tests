import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateAccountNumber } from '../helpers/generators.helpers.js'

export default function (company) {
  const billingAccountId = generateUUID()
  const accountNumber = generateAccountNumber()

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
