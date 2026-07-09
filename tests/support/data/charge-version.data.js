import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function (licenceData, billingAccountData) {
  const {
    licences: [licence],
    companies: [company]
  } = licenceData

  const {
    billingAccounts: [billingAccount]
  } = billingAccountData

  return {
    chargeVersions: [
      {
        id: generateUUID(),
        licenceId: licence.id,
        licenceRef: licence.licenceRef,
        billingAccountId: billingAccount.id,
        regionCode,
        scheme: 'alcs',
        versionNumber: 1,
        startDate: licence.startDate,
        status: 'current',
        source: 'wrls',
        companyId: company.id
      }
    ]
  }
}
