import { regionCode } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (billingAccountData, licenceData) {
  const chargeVersionId = generateUUID()

  const {
    billingAccounts: [billingAccount]
  } = billingAccountData

  const {
    companies: [company],
    licences: [licence]
  } = licenceData

  return {
    chargeVersions: [
      {
        id: chargeVersionId,
        licenceId: licence.id,
        licenceRef: licence.licenceRef,
        billingAccountId: billingAccount.id,
        regionCode,
        scheme: 'alcs',
        versionNumber: 1,
        startDate: '2018-01-01',
        status: 'current',
        source: 'wrls',
        companyId: company.id
      }
    ]
  }
}
