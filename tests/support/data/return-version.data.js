import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../default-values.js'

export default function (licence) {
  const returnVersionId = generateUUID()

  return {
    id: returnVersionId,
    version: 101,
    startDate: licence.startDate,
    endDate: null,
    status: 'current',
    externalId: `${regionCode}:9999990`,
    licenceId: licence.id,
    multipleUpload: licence.waterUndertaker,
    quarterlyReturns: licence.waterUndertaker
  }
}
