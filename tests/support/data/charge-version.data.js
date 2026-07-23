import { regionCode } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

const srocStartDate = '2022-04-01'

export default function (billingAccountData, licenceData) {
  const chargeVersionId = generateUUID()

  const {
    billingAccounts: [billingAccount]
  } = billingAccountData

  const {
    companies: [company],
    licences: [licence]
  } = licenceData

  const scheme = licence.startDate < srocStartDate ? 'alcs' : 'sroc'

  const chargeVersion = {
    id: chargeVersionId,
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode,
    scheme,
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

  if (scheme === 'alcs') {
    chargeVersion.companyId = company.id
  }

  return {
    chargeVersions: [chargeVersion]
  }
}
