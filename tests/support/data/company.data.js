import { generateCompanyExternalId, generateUUID } from 'water-abstraction-engine/test/generators.js'

import { companyName } from '../default-values.js'

export default function () {
  const companyId = generateUUID()
  const companyExternalId = generateCompanyExternalId()

  return {
    id: companyId,
    externalId: companyExternalId,
    name: companyName,
    type: 'organisation'
  }
}
