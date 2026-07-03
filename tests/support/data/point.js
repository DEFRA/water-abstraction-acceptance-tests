import { generateUUID } from '../helpers/generate-uuid.js'

export default function (description = 'The Name of this', ngr1 = 'TG 123 456') {
  const pointId = generateUUID()

  return {
    points: [
      {
        id: pointId,
        description,
        ngr1,
        externalId: '9:9000091',
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
