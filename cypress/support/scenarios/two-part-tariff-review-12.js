import chargeVersionData from '../fixture-builder/two-part-tariff-review-charge-version.js'
import reviewLicenceData from '../fixture-builder/two-part-tariff-review-licence.js'

export const title = 'Two-part tariff review 12'
export const description =
  'Testing a two-part tariff bill run with a licence that is current and not in workflow, it has one applicable charge version with 2 charge references and each have a charge element. It has one return that has matched to both charge references'

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
        volume: 32,
        eiucRegion: 'Southern',
        section127Agreement: true
      },
      {
        id: 'f5c0a971-2f9c-46d5-877d-b560ae6003e2',
        chargeVersionId: '8e5626ee-5e4c-48f6-a668-471d35997e2c',
        description: 'SROC Charge Reference 01',
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
          aggregate: null,
          s126: null,
          s127: true,
          s130: false,
          charge: null,
          winter: false
        },
        waterModel: 'no model',
        volume: 32,
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
        abstractionPeriodEndMonth: 10,
        authorisedAnnualQuantity: 18,
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
        id: '9bfc9f79-70cd-4c8c-bc78-178bf262fc7e',
        chargeReferenceId: 'f5c0a971-2f9c-46d5-877d-b560ae6003e2',
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 11,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 14,
        section127Agreement: true,
        description: 'SROC Charge Purpose 02',
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
            periodStartMonth: '4',
            periodEndDay: '31',
            periodEndMonth: '3'
          }
        },
        startDate: `${startYear}-04-01`,
        endDate: `${endYear}-03-21`,
        receivedDate: `${endYear}-03-01`,
        dueDate: `${endYear}-04-28`,
        returnId: `v1:1:AT/TE/ST/01/01:10021668:${startYear}-04-01:${endYear}-03-31`,
        status: 'completed',
        underQuery: false
      }
    ],
    returnSubmissions: [
      {
        id: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        returnLogId: '6a1b2456-e9af-4845-b5a9-a54497dff769',
        returnId: `v1:1:AT/TE/ST/01/01:10021668:${startYear}-04-01:${endYear}-03-31`,
        nilReturn: false,
        current: true
      }
    ],
    returnSubmissionLines: [
      {
        id: '89966f6f-bc62-40bf-97a5-3c7bfeeb2a3b',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-04-01`,
        endDate: `${startYear}-04-30`,
        quantity: '4000'
      },
      {
        id: '7e503eb2-323e-4b17-9d0c-2c8ad1ebe575',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-05-01`,
        endDate: `${startYear}-05-31`,
        quantity: '4000'
      },
      {
        id: '0438b460-52d6-40b5-9dfd-963a63ada23d',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-06-01`,
        endDate: `${startYear}-06-30`,
        quantity: '4000'
      },
      {
        id: 'e6a493df-241a-47de-ae62-b976d2ff9941',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-07-01`,
        endDate: `${startYear}-07-31`,
        quantity: '4000'
      },
      {
        id: 'd2424aad-ba47-4a5e-bdc4-6570655f7807',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-08-01`,
        endDate: `${startYear}-08-31`,
        quantity: '2000'
      },
      {
        id: 'fb9d239e-0428-4ca4-a7fd-49ae9ac1d6c7',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-11-01`,
        endDate: `${startYear}-11-30`,
        quantity: '4000'
      },
      {
        id: '85216196-0191-4fa3-9d3d-c1dba7d167ab',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${startYear}-12-01`,
        endDate: `${startYear}-12-31`,
        quantity: '4000'
      },
      {
        id: '802c7690-0006-4267-af3e-7dcf29dda03c',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${endYear}-01-01`,
        endDate: `${endYear}-01-31`,
        quantity: '4000'
      },
      {
        id: '30854030-2b23-4a3a-b4e4-1a30d3d6d260',
        returnSubmissionId: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        startDate: `${endYear}-03-01`,
        endDate: `${endYear}-03-31`,
        quantity: '2000'
      }
    ]
  }
}
