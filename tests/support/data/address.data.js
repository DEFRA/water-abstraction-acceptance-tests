import { fakerEN_GB as faker } from '@faker-js/faker'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function () {
  const addressId = generateUUID()

  return {
    id: addressId,
    address1: faker.location.buildingNumber(),
    address2: faker.location.street(),
    address3: faker.location.county(),
    address4: faker.location.city(),
    postcode: faker.location.zipCode(),
    country: 'United Kingdom',
    dataSource: 'wrls'
  }
}
