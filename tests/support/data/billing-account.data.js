import { generateAccountNumber, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (company, region) {
  const billingAccountId = generateUUID()
  const accountNumber = generateAccountNumber(region.chargeRegionId)

  return {
    id: billingAccountId,
    accountNumber,
    companyId: company.id
  }
}
