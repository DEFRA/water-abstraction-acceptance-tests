import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { users } from '../default-values.js'

export default function (billingAccount, licence, region) {
  const chargeVersionId = generateUUID()

  return {
    id: chargeVersionId,
    licenceId: licence.id,
    licenceRef: licence.licenceRef,
    billingAccountId: billingAccount.id,
    regionCode: region.naldRegionId,
    scheme: 'sroc',
    versionNumber: 100,
    startDate: licence.startDate,
    status: 'current',
    source: 'wrls',
    createdBy: {
      id: users.BILLING_AND_DATA.userId,
      email: users.BILLING_AND_DATA.username
    },
    approvedBy: {
      id: users.BILLING_AND_DATA.userId,
      email: users.BILLING_AND_DATA.username
    },
    changeReasonId: {
      schema: 'public',
      table: 'changeReasons',
      lookup: 'description',
      value: 'New licence',
      select: 'id'
    }
  }
}
