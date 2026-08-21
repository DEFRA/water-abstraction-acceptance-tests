import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { regionCode } from '../default-values.js'

export default function (billingAccount, licence) {
  const chargeVersionId = generateUUID()

  return {
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
      schema: 'public',
      table: 'changeReasons',
      lookup: 'description',
      value: 'New licence',
      select: 'id'
    }
  }
}
