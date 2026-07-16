import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData, accountNumber = 'S99999991A') {
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
