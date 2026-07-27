import { regionCode } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (billingAccountData, licenceData) {
  const chargeVersionId = generateUUID()

  const {
    billingAccounts: [billingAccount]
  } = billingAccountData

  const {
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
        scheme: 'sroc',
        versionNumber: 100,
        startDate: licence.startDate,
        status: 'current',
        source: 'wrls',
        changeReasonId: {
          schema: 'water',
          table: 'changeReasons',
          lookup: 'description',
          value: 'New licence',
          select: 'changeReasonId'
        }
      }
    ]
  }
}
