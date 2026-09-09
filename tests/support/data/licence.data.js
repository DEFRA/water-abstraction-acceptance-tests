import { generateLicenceRef, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (startDate, region) {
  const licenceId = generateUUID()
  const licenceRef = generateLicenceRef()

  // TODO: this is a temporary change to enable us to gradually migrate away from the test region.
  if (!region) {
    region = {
      naldRegionId: 9
    }
  }

  return {
    id: licenceId,
    licenceRef,
    regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: region.naldRegionId, select: 'id' },
    regions: {
      historicalAreaCode: 'SAAR',
      regionalChargeArea: 'Southern'
    },
    startDate,
    waterUndertaker: false
  }
}
