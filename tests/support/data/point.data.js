import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function () {
  const pointId = generateUUID()

  return {
    points: [
      {
        id: pointId,
        description: 'Example point 1',
        ngr1: 'TQ 1234 5678',
        externalId: `${regionCode}:9000091`,
        sourceId: {
          schema: 'public',
          table: 'sources',
          lookup: 'legacyId',
          value: 'S',
          select: 'id'
        }
      }
    ]
  }
}
