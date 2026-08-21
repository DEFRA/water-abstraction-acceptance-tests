import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (billingAccount, address) {
  const billingAccountAddressId = generateUUID()

  return {
    id: billingAccountAddressId,
    billingAccountId: billingAccount.id,
    addressId: address.id,
    startDate: '2022-04-01'
  }
}
