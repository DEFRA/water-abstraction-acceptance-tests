import chargeVersionData from '../fixture-builder/two-part-tariff-review-charge-version.js'
import reviewLicenceData from '../fixture-builder/two-part-tariff-review-licence.js'

export const title = 'Two-part tariff review 08'
export const description =
  'Testing a two-part tariff bill run with a similar licence to scenario one, licence is current and not in workflow, it has one applicable charge version with a single charge reference and one charge element. It has one nil return'

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
        status: 'completed',
        underQuery: false
      }
    ],
    returnSubmissions: [
      {
        id: 'fb740b60-71f6-4fc8-8cce-02ae55a188cd',
        returnLogId: '6a1b2456-e9af-4845-b5a9-a54497dff769',
        returnId: `v1:1:AT/TE/ST/01/01:10021668:${startYear}-04-01:${endYear}-03-31`,
        nilReturn: true,
        current: true
      }
    ]
  }
}
