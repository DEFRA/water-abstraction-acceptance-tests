import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (billingAccount, licence, region) {
  const chargeVersionId = generateUUID()

  if (!region) {
    region = {
      naldRegionId: 9
    }
  }

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
    changeReasonId: {
      schema: 'public',
      table: 'changeReasons',
      lookup: 'description',
      value: 'New licence',
      select: 'id'
    }
  }
}
