import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licence) {
  const returnVersionId = generateUUID()

  return {
    id: returnVersionId,
    version: 101,
    startDate: licence.startDate,
    endDate: null,
    status: 'current',
    licenceId: licence.id,
    multipleUpload: licence.waterUndertaker,
    quarterlyReturns: licence.waterUndertaker
  }
}
