import licenceData from '../fixture-builder/licence.js'

export default function() {
  return {
    ...licenceData(),
    billRuns: [
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
        id: 'fb1c7c5d-e723-4ab2-861e-5aae6d428019',
        licenceId: '8717da0e-28d4-4833-8e32-1da050b60055',
        licenceRef: 'AT/CURR/DAILY/01',
        billingAccountId: '16cb50a5-e3e6-41f4-a42b-9dad6a69fc0c',
        regionCode: 9,
        scheme: 'alcs',
        versionNumber: 1,
        startDate: '2018-01-01',
        status: 'current',
        source: 'wrls',
        companyId: 'e8abdbb4-aeea-47d4-91b2-97bf82bc2778'
      }
    ],
    chargeReferences: [
      {
        id: '69ea7fd9-961b-4d5d-be8b-ecd0e9cc8482',
        chargeVersionId: 'fb1c7c5d-e723-4ab2-861e-5aae6d428019',
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
          value: '140',
          select: 'id'
        },
        chargeCategoryId: null,
        additionalCharges: {},
        scheme: 'alcs',
        adjustments: null,
        eiucRegion: null,
        section127Agreement: null,
        restrictedSource: false
      }
    ]
  }
}
