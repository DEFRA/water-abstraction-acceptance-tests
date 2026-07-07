import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function (licenceData) {
  const {
    licences: [licence]
  } = licenceData

  const returnVersionId = generateUUID()

  return {
    returnVersions: [
      {
        id: returnVersionId,
        version: 101,
        startDate: licence.startDate,
        endDate: null,
        status: 'current',
        externalId: `${regionCode}:9999990`,
        licenceId: licence.id
      }
    ]
  }
}
