import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function (licenceRef, companyData) {
  const licenceDocumentHeaderId = generateUUID()
  const licenceDocumentId = generateUUID()
  const licenceId = generateUUID()
  const licenceVersionId = generateUUID()

  const {
    companies: [company],
    addresses: [address]
  } = companyData

  return {
    permitLicences: [
      {
        licenceRef,
        startDate: '2020-01-01',
        metadata: {
          source: 'acceptance-test-setup'
        }
      }
    ],
    licenceDocumentHeaders: [
      {
        id: licenceDocumentHeaderId,
        regimeEntityId: {
          schema: 'crm',
          table: 'entity',
          lookup: 'entityType',
          value: 'regime',
          select: 'entityId'
        },
        licenceRef,
        naldId: {
          schema: 'public',
          table: 'permitLicences',
          lookup: 'licenceRef',
          value: licenceRef,
          select: 'id'
        },
        metadata: {
          Name: 'cupcake factory',
          dataType: 'acceptance-test-setup',
          IsCurrent: true,
          Salutation: '',
          AddressLine1: 'Big Farm',
          AddressLine2: 'Windy road',
          AddressLine3: 'Buttercup meadow',
          AddressLine4: 'Buttercup Village',
          Town: 'Testington',
          County: 'Testingshire',
          Postcode: 'TT1 1TT',
          Country: 'United Kingdom',
          contacts: [
            {
              name: 'Environment Agency',
              role: 'Licence holder',
              town: 'Bristol',
              type: 'Organisation',
              county: null,
              country: null,
              forename: null,
              initials: null,
              postcode: 'BS1 5AH',
              salutation: null,
              addressLine1: 'Horizon House',
              addressLine2: 'Dean Lane',
              addressLine3: null,
              addressLine4: null
            }
          ]
        },
        licence_name: 'the daily cupcake licence'
      }
    ],
    licenceDocuments: [
      {
        id: licenceDocumentId,
        licenceRef,
        startDate: '2018-01-01'
      }
    ],
    licenceDocumentRoles: [
      {
        licenceDocumentId,
        licenceRoleId: {
          schema: 'public',
          table: 'licenceRoles',
          lookup: 'name',
          value: 'licenceHolder',
          select: 'id'
        },
        startDate: '2018-01-01',
        companyId: company.id,
        addressId: address.id
      }
    ],
    licences: [
      {
        id: licenceId,
        licenceRef,
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        regions: {
          historicalAreaCode: 'SAAR',
          regionalChargeArea: 'Southern'
        },
        startDate: '2018-01-01',
        waterUndertaker: false
      }
    ],
    licenceVersions: [
      {
        id: licenceVersionId,
        licenceId,
        issue: 1,
        increment: 0,
        status: 'current',
        startDate: '2018-01-01',
        externalId: `${regionCode}:1234:1:0`,
        companyId: company.id,
        addressId: address.id
      }
    ]
  }
}
