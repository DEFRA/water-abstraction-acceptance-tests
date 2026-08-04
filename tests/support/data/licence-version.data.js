import { regionCode } from '../default-values.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licence, company, address) {
  const licenceVersionId = generateUUID()

  return {
    id: licenceVersionId,
    licenceId: licence.id,
    issue: 1,
    increment: 0,
    status: 'current',
    startDate: licence.startDate,
    externalId: `${regionCode}:1234:1:0`,
    companyId: company.id,
    addressId: address.id
  }
}
