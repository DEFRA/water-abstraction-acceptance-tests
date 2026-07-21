import { generateUUID } from '../helpers/generate-uuid.js'
import { companyName } from '../default-values.js'

export default function () {
  const addressId = generateUUID()
  const companyId = generateUUID()

  return {
    companies: [
      {
        id: companyId,
        name: companyName,
        type: 'organisation'
      }
    ],
    addresses: [
      {
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
    ],
    companyAddresses: [
      {
        companyId,
        addressId,
        startDate: '2008-04-01',
        licenceRoleId: {
          schema: 'crm_v2',
          table: 'roles',
          lookup: 'name',
          value: 'billing',
          select: 'roleId'
        }
      }
    ]
  }
}
