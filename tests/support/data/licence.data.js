import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licenceRef, startDate) {
  const licenceId = generateUUID()

  return {
    id: licenceId,
    licenceRef,
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
    regions: {
      historicalAreaCode: 'SAAR',
      regionalChargeArea: 'Southern'
    },
    startDate,
    waterUndertaker: false
  }
}
