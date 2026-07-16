import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

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
        startDate: '2022-04-01',
        status: 'current',
        source: 'wrls',
        changeReasonId: {
          schema: 'water',
          table: 'changeReasons',
          lookup: 'description',
          value: 'Strategic review of charges (SRoC)',
          select: 'changeReasonId'
        }
      }
    ]
  }
}
