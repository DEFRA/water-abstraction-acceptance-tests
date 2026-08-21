import { generateUUID } from '../helpers/generate-uuid.js'

export default function () {
  const addressId = generateUUID()

  return {
    id: addressId,
    address1: 'ENVIRONMENT AGENCY',
    address2: 'HORIZON HOUSE',
    address3: 'DEANERY ROAD',
    address4: 'BRISTOL',
    postcode: 'BS1 5AH',
    country: 'United Kingdom',
    dataSource: 'wrls'
  }
}
