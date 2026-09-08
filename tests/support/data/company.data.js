import { faker } from '@faker-js/faker'
import { generateCompanyExternalId, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (region) {
  const companyId = generateUUID()
  const companyExternalId = generateCompanyExternalId(region)

  return {
    id: companyId,
    externalId: companyExternalId,
    name: faker.company.name(),
    type: 'organisation'
  }
}
