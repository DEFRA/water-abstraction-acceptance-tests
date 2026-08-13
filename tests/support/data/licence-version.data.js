import { generateUUID } from '../helpers/generate-uuid.js'
import { generateTestExternalId } from '../helpers/generate-test-ref.js'

export default function (licence, company, address) {
  const licenceVersionId = generateUUID()
  const issue = 1
  const increment = 0

  return {
    id: licenceVersionId,
    licenceId: licence.id,
    issue,
    increment,
    status: 'current',
    startDate: licence.startDate,
    externalId: generateTestExternalId(issue, increment),
    companyId: company.id,
    addressId: address.id
  }
}
