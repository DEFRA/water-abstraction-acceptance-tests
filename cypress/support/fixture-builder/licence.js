import pointsData from './points.js'

export default function licence () {
  const points = pointsData().points

  const basicLicence = {
    permitLicences: [
      {
        licenceRef: 'AT/TE/ST/01/01',
        startDate: '2020-01-01',
        metadata: {
          source: 'acceptance-test-setup'
        }
      }
    ],
    licenceEntities: [
      {
        id: '1742895f-5e18-41e0-94bd-d5c9845cb558',
        name: 'external@example.com',
        type: 'individual'
      },
      {
        id: 'e86c312b-222d-404f-ae08-eb90a80bec18',
        name: 'Big Farm Co Ltd',
        type: 'company'
      }
    ],
    licenceEntityRoles: [
      {
        id: 'f99998c5-0676-43c3-bf6c-41b1103111bf',
        licenceEntityId: '1742895f-5e18-41e0-94bd-d5c9845cb558',
        companyEntityId: 'e86c312b-222d-404f-ae08-eb90a80bec18',
        role: 'primary_user',
        createdBy: 'acceptance-test-setup'
      }
    ],
    licenceDocumentHeaders: [
      {
        id: 'c86c9d49-e06f-4792-8307-8e2c38aa6838',
        regimeEntityId: {
          schema: 'crm',
          table: 'entity',
          lookup: 'entityType',
          value: 'regime',
          select: 'entityId'
        },
        licenceRef: 'AT/TE/ST/01/01',
        naldId: {
          schema: 'public',
          table: 'permitLicences',
          lookup: 'licenceRef',
          value: 'AT/TE/ST/01/01',
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
        companyEntityId: 'e86c312b-222d-404f-ae08-eb90a80bec18'
      }
    ],
    companies: [
      {
        id: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778',
        name: 'Big Farm Co Ltd',
        type: 'organisation'
      }
    ],
    addresses: [
      {
        id: '62549cdb-073f-4d5c-a2a1-c47b0b910010',
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
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778',
        addressId: '62549cdb-073f-4d5c-a2a1-c47b0b910010',
        startDate: '2008-04-01',
        licenceRoleId: {
          schema: 'crm_v2',
          table: 'roles',
          lookup: 'name',
          value: 'billing',
          select: 'roleId'
        }
      }
    ],
    contacts: [
      {
        id: '6e05db31-39cd-4bb0-83a0-0d985037ad8f',
        salutation: 'Mr',
        firstName: 'John',
        lastName: 'Testerson',
        middleInitials: 'J',
        contactType: 'person',
        dataSource: 'nald'
      }
    ],
    companyContacts: [
      {
        id: 'e01e7717-719f-47ed-8431-362f6b4de422',
        contactId: '6e05db31-39cd-4bb0-83a0-0d985037ad8f',
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778',
        licenceRoleId: {
          schema: 'crm_v2',
          table: 'roles',
          lookup: 'name',
          value: 'licenceHolder',
          select: 'roleId'
        },
        startDate: '2018-01-01'
      }
    ],
    licenceDocuments: [
      {
        id: '1a274f3e-f891-43dd-8c25-8afac4e760ac',
        licenceRef: 'AT/TE/ST/01/01',
        startDate: '2018-01-01'
      }
    ],
    licenceDocumentRoles: [
      {
        licenceDocumentId: '1a274f3e-f891-43dd-8c25-8afac4e760ac',
        licenceRoleId: {
          schema: 'public',
          table: 'licenceRoles',
          lookup: 'name',
          value: 'licenceHolder',
          select: 'id'
        },
        startDate: '2018-01-01',
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778',
        addressId: '62549cdb-073f-4d5c-a2a1-c47b0b910010',
        contactId: '6e05db31-39cd-4bb0-83a0-0d985037ad8f'
      }
    ],
    points,
    licences: [
      {
        id: '8717da0e-28d4-4833-8e32-1da050b60055',
        licenceRef: 'AT/TE/ST/01/01',
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
        id: '7ac6be4b-b7a0-4e35-9cd4-bd1c783af32b',
        licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
        issue: 1,
        increment: 0,
        status: 'current',
        startDate: '2018-01-01',
        externalId: '6:1234:1:0'
      }
    ],
    licenceVersionPurposes: [
      {
        id: 'f264184b-22a7-4e26-bd90-d5738eb2e07e',
        licenceVersionId: '7ac6be4b-b7a0-4e35-9cd4-bd1c783af32b',
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
        licenceVersionPurposeId: 'f264184b-22a7-4e26-bd90-d5738eb2e07e',
        pointId: points[0].id
      }
    ]
  }

  return basicLicence
}
