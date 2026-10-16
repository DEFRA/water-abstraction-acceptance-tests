import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateAddress } from '../helpers/generators.helpers.js'

export default function () {
  const addressId = generateUUID()

  const { address1, address2, address3, address4, postcode } = generateAddress()

  return {
    id: addressId,
    address1,
    address2,
    address3,
    address4,
    postcode,
    country: 'United Kingdom',
    dataSource: 'wrls'
  }
}
