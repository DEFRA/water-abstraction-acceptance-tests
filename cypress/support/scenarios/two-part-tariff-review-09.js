import chargeVersionData from '../fixture-builder/two-part-tariff-review-charge-version.js'
import reviewLicenceData from '../fixture-builder/two-part-tariff-review-licence.js'

export const title = 'Two-part tariff review 09'
export const description =
  'Testing a two-part tariff bill run with a licence that is current and not in workflow, it has one applicable charge version with two charge references, each with one charge element. Both elements have a matching return that has a status of "due"'

export default function (endYear, startYear) {
  return {
    ...reviewLicenceData(),
    chargeVersions: [chargeVersionData()],
    chargeReferences: [
      {
        id: 'fa3c73d0-0459-41f0-b6cf-0e0758775ca4',
        chargeVersionId: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
        description: 'SROC Charge Reference 01',
        source: 'tidal',
        loss: 'medium',
        factorsOverridden: false,
        chargeCategoryId: {
          schema: 'public',
          table: 'chargeCategories',
          lookup: 'reference',
          value: '4.6.12',
          select: 'id'
        },
        adjustments: {
          aggregate: null,
          s126: null,
          s127: true,
          s130: false,
          charge: null,
          winter: false
        },
        waterModel: 'no model',
        volume: 52,
        eiucRegion: 'Southern',
        section127Agreement: true
      },
      {
        id: '678997c5-1157-4b80-9800-c32960d05299',
        chargeVersionId: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
        description: 'SROC Charge Reference 02',
        source: 'tidal',
        loss: 'medium',
        factorsOverridden: false,
        chargeCategoryId: {
          schema: 'public',
          table: 'chargeCategories',
          lookup: 'reference',
          value: '4.6.19',
          select: 'id'
        },
        adjustments: {
          s126: null,
          s127: true,
          s130: false,
          charge: null,
          winter: false
        },
        waterModel: 'no model',
        volume: 22,
        eiucRegion: 'Southern',
        section127Agreement: true
      }
    ],
    chargeElements: [
      {
        id: '0be51375-17b9-40f6-81f5-bd769ba10508',
        chargeReferenceId: 'fa3c73d0-0459-41f0-b6cf-0e0758775ca4',
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 32,
        section127Agreement: true,
        description: 'SROC Charge Purpose 01',
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: '140',
          select: 'id'
        },
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
        }
      },
      {
        id: '6125a201-6d2e-41f8-85bd-8a5bbf455943',
        chargeReferenceId: '678997c5-1157-4b80-9800-c32960d05299',
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 42,
        section127Agreement: true,
        description: 'SROC Charge Purpose 02',
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: '300',
          select: 'id'
        },
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
        }
      }
    ],
    returnLogs: [
      {
        id: '6a1b2456-e9af-4845-b5a9-a54497dff769',
        returnReference: '10021668',
        licenceRef: 'AT/TE/ST/01/01',
        metadata: {
          description: 'A DRAIN SOMEWHERE',
          purposes: [
            {
              primary: {
                code: 'A',
                description: 'Agriculture'
              },
              tertiary: {
                code: '140',
                description: 'General Farming & Domestic'
              },
              secondary: {
                code: 'AGR',
                description: 'General Agriculture'
              }
            }
          ],
          isTwoPartTariff: true,
          nald: {
            periodStartDay: '1',
            periodStartMonth: '3',
            periodEndDay: '31',
            periodEndMonth: '10'
          }
        },
        startDate: `${startYear}-04-01`,
        endDate: `${endYear}-03-21`,
        receivedDate: `${endYear}-03-01`,
        dueDate: `${endYear}-04-28`,
        returnId: `v1:1:AT/TE/ST/01/01:10021668:${startYear}-04-01:${endYear}-03-31`,
        status: 'due',
        underQuery: false
      },
      {
        id: '8211606e-302f-4547-9fd0-f3970443ba6d',
        returnReference: '10021668',
        licenceRef: 'AT/TE/ST/01/01',
        metadata: {
          description: 'A DRAIN SOMEWHERE',
          purposes: [
            {
              primary: {
                code: 'A',
                description: 'Agriculture'
              },
              tertiary: {
                code: '300',
                description: 'Mineral Washing'
              },
              secondary: {
                code: 'AGR',
                description: 'General Agriculture'
              }
            }
          ],
          isTwoPartTariff: true,
          nald: {
            periodStartDay: '1',
            periodStartMonth: '3',
            periodEndDay: '31',
            periodEndMonth: '10'
          }
        },
        startDate: `${startYear}-10-01`,
        endDate: `${endYear}-03-31`,
        receivedDate: `${endYear}-03-01`,
        dueDate: `${endYear}-04-28`,
        returnId: `v2:1:AT/TE/ST/01/01:10021668:${startYear}-10-01:${endYear}-03-31`,
        status: 'due',
        underQuery: false
      }
    ]
  }
}
