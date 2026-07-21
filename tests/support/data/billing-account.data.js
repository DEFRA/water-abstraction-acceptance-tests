import { accountNumber } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData) {
  const billingAccountAddressId = generateUUID()
  const billingAccountId = generateUUID()

  const {
    addresses: [address],
    companies: [company]
  } = licenceData

  return {
    billingAccounts: [
      {
        id: billingAccountId,
        accountNumber,
        companyId: company.id
      }
    ],
    billingAccountAddresses: [
      {
        id: billingAccountAddressId,
        billingAccountId,
        addressId: address.id,
        startDate: '2022-04-01'
      }
    ]
  }
}
