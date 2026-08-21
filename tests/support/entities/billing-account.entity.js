import billingAccountAddressData from '../data/billing-account-address.data.js'
import billingAccountData from '../data/billing-account.data.js'

/**
 * Builds a billing account in its entirety: the billing account itself and its billing account address — the
 * minimum valid data a billing account needs to exist.
 *
 * @param {object} company - the company the billing account belongs to
 * @param {object} address - the address linked to the billing account
 */
export default function (company, address) {
  const billingAccount = billingAccountData(company)
  const billingAccountAddress = billingAccountAddressData(billingAccount, address)

  return {
    billingAccount,
    billingAccountAddress
  }
}
