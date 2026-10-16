import { generateLicenceRef, generateUUID } from 'water-abstraction-engine/test/generators.js'

import { eiucRegions } from '../default-values.js'

export default function (startDate, region) {
  const licenceId = generateUUID()
  const licenceRef = generateLicenceRef()

  return {
    id: licenceId,
    licenceRef,
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: region.naldRegionId, select: 'id' },
    regions: {
      historicalAreaCode: 'SAAR',
      regionalChargeArea: eiucRegions[region.naldRegionId]
    },
    startDate,
    waterUndertaker: false
  }
}
