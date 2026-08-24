import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generatePointExternalId } from '../helpers/generators.helpers.js'

export default function () {
  const pointId = generateUUID()

  return {
    id: pointId,
    description: 'Example point 1',
    ngr1: 'TQ 1234 5678',
    externalId: generatePointExternalId(),
    sourceId: {
      schema: 'public',
      table: 'sources',
      lookup: 'legacyId',
      value: 'S',
      select: 'id'
    }
  }
}
