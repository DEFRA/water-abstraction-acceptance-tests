import { generateLicenceVersionExternalId, generateUUID } from 'water-abstraction-engine/test/generators.js'

export default function (licence, company, address) {
  const licenceVersionId = generateUUID()

  return {
    id: licenceVersionId,
    licenceId: licence.id,
    issue: 1,
    increment: 0,
    status: 'current',
    startDate: licence.startDate,

    externalId: generateLicenceVersionExternalId(),
    companyId: company.id,
    addressId: address.id
  }
}
