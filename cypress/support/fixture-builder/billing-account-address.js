import billingAccountData from './billing-account.js'
import licenceData from './licence.js'

export default function billingAccountAddress () {
  const billingAccount = billingAccountData()

  return {
    id: 'ab9a24ec-80b8-40dc-82f8-7df3e885245a',
    billingAccountId: billingAccount.id,
    addressId: licenceData().addresses[0].id,
    startDate: licenceData().licences[0].startDate
  }
}
