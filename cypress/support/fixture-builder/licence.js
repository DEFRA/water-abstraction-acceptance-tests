export default function licence () {
  const basicLicence = {
    permitLicences: [
      {
        licenceRef: 'AT/CURR/DAILY/01',
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
        licenceRef: 'AT/CURR/DAILY/01',
        naldId: {
          schema: 'public',
          table: 'permitLicences',
          lookup: 'licenceRef',
          value: 'AT/CURR/DAILY/01',
          select: 'id'
        },
        metadata: {
          Name: 'cupcake factory',
          dataType: 'acceptance-test-setup',
          IsCurrent: true
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
        licenceRef: 'AT/CURR/DAILY/01',
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
    licences: [
      {
        id: '8717da0e-28d4-4833-8e32-1da050b60055',
        licenceRef: 'AT/CURR/DAILY/01',
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        regions: {
          historicalAreaCode: 'SAAR',
          regionalChargeArea: 'Southern'
        },
        startDate: '2020-01-01',
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
        startDate: '2020-01-01',
        externalId: '6:1234:1:0'
      }
    ]
  }

  return basicLicence
}
