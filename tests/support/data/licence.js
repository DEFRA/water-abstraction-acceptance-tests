import { randomUUID } from 'crypto'

export default function (licenceRef, companyData, primaryUserData = null) {
  const licenceDocumentHeaderId = randomUUID()
  const licenceDocumentId = randomUUID()
  const pointId = randomUUID()
  const licenceId = randomUUID()
  const licenceVersionId = randomUUID()
  const licenceVersionPurposeId = randomUUID()

  const {
    companies: [company],
    addresses: [address]
  } = companyData

  // When there is a primary user, we need to link them to the 'licenceDocumentHeaders'; this is the only way we can
  // link a registered licence to a licence holder.
  const companyEntityId = primaryUserData ? primaryUserData.licenceEntityRoles[0].companyEntityId : null

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
        licence_name: 'the daily cupcake licence',
        companyEntityId
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
    points: [
      {
        id: pointId,
        description: 'Example point 1',
        ngr1: 'TQ 1234 5678',
        externalId: '9:9000090',
        sourceId: {
          schema: 'public',
          table: 'sources',
          lookup: 'legacyId',
          value: 'S',
          select: 'id'
        }
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
        waterUndertaker: true
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
        externalId: '6:1234:1:0',
        companyId: company.id,
        addressId: address.id
      }
    ],
    licenceVersionPurposes: [
      {
        id: licenceVersionPurposeId,
        licenceVersionId,
        primaryPurposeId: {
          schema: 'water',
          table: 'purposesPrimary',
          lookup: 'legacyId',
          value: 'A',
          select: 'purposePrimaryId'
        },
        secondaryPurposeId: {
          schema: 'water',
          table: 'purposesSecondary',
          lookup: 'legacyId',
          value: 'AGR',
          select: 'purposeSecondaryId'
        },
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: '140',
          select: 'id'
        },
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        annualQuantity: 1554,
        externalId: '6:1234'
      }
    ],
    licenceVersionPurposePoints: [
      {
        licenceVersionPurposeId,
        pointId
      }
    ]
  }
}
