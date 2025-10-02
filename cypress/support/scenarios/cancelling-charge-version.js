import licenceData from '../fixture-builder/licence.js'

export default function () {
  return {
    ...licenceData(),
    billRuns: [
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        batchType: 'annual',
        fromFinancialYearEnding: 2023,
        toFinancialYearEnding: 2023,
        status: 'sent'
      },
      {
        regionId: { schema: 'public', table: 'regions', lookup: 'naldRegionId', value: 9, select: 'id' },
        batchType: 'two_part_tariff',
        fromFinancialYearEnding: '2023',
        toFinancialYearEnding: '2023',
        status: 'sent'
      }
    ],
    chargeVersions: [
      {
        id: 'fdb1295d-4c6e-401f-89af-ef0dfc9696ac',
        licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
        licenceRef: 'AT/TEST/01',
        billingAccountId: '16cb50a5-e3e6-41f4-a42b-9dad6a69fc0c',
        regionCode: 9,
        scheme: 'sroc',
        versionNumber: 1,
        startDate: '2022-04-01',
        status: 'current',
        source: 'wrls',
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778'
      }
    ],
    chargeReferences: [
      {
        id: '410b2a12-88f7-4fef-9b20-c223a3fee5af',
        chargeVersionId: 'fdb1295d-4c6e-401f-89af-ef0dfc9696ac',
        factorsOverridden: false,
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        description: 'Test Charge Element!',
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 15.54,
        season: 'all year',
        seasonDerived: 'all year',
        source: 'unsupported',
        loss: 'medium',
        purposePrimaryId: {
          schema: 'water',
          table: 'purposesPrimary',
          lookup: 'legacyId',
          value: 'A',
          select: 'purposePrimaryId'
        },
        purposeSecondaryId: {
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
          value: 140,
          select: 'id'
        },
        chargeCategoryId: null,
        additionalCharges: {},
        scheme: 'sroc',
        adjustments: {
          s127: 'true'
        },
        eiucRegion: null,
        section127Agreement: true,
        restrictedSource: false
      }
    ],
    chargeElements: [
      {
        chargeReferenceId: '410b2a12-88f7-4fef-9b20-c223a3fee5af',
        section127Agreement: true,
        purposePrimaryId: {
          schema: 'water',
          table: 'purposesPrimary',
          lookup: 'legacyId',
          value: 'A',
          select: 'purposePrimaryId'
        },
        purposeSecondaryId: {
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
          value: 140,
          select: 'id'
        }
      }
    ],
    workflows: [
      {
        licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
        status: 'review',
        createdAt: '2020-04-01',
        updatedAt: '2020-04-01',
        createdBy: {
          id: 100331,
          email: 'billing.data@wrls.gov.uk'
        },
        data: {
          chargeVersion: {
            scheme: 'alcs',
            status: 'draft',
            dateRange: {
              startDate: '2020-01-01'
            },
            changeReason: {
              id: 'db22c827-c74d-40d9-aab8-282fd9843933',
              type: 'new_non_chargeable_charge_version',
              description: 'Aggregate licence',
              triggersMinimumCharge: false,
              isEnabledForNewChargeVersions: true
            },
            chargeElements: []
          }
        }
      }
    ]
  }
}
