import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { companyName } from '../default-values.js'

export default function () {
  const companyId = generateUUID()

  return {
    id: companyId,
    name: companyName,
    type: 'organisation'
  }
}
