import { generateUUID } from '../helpers/generate-uuid.js'

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
        externalId: '6:9999990',
        licenceId: licence.id
      }
    ]
  }
}
