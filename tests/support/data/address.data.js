import { generateUUID } from '../helpers/generate-uuid.js'

export default function () {
  const addressId = generateUUID()

  return {
    id: addressId,
    address1: 'Big Farm',
    address2: 'Windy road',
    address3: 'Buttercup meadow',
    address4: 'Buttercup Village',
    address5: 'Testington',
    address6: 'Testingshire',
    postcode: 'TT1 1TT',
    country: 'UK',
    dataSource: 'nald'
  }
}
