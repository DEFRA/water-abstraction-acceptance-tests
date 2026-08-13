import { generateUUID } from '../helpers/generate-uuid.js'
import { generateTestExternalId } from '../helpers/generate-test-ref.js'

export default function () {
  const pointId = generateUUID()

  return {
    id: pointId,
    description: 'Example point 1',
    ngr1: 'TQ 1234 5678',
    externalId: generateTestExternalId(),
    sourceId: {
      schema: 'public',
      table: 'sources',
      lookup: 'legacyId',
      value: 'S',
      select: 'id'
    }
  }
}
