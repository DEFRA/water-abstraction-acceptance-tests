import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData) {
  const chargeElementId = generateUUID()
  const chargeReferenceId = generateUUID()

  const {
    chargeVersions: [chargeVersion]
  } = licenceData

  return {
    chargeReferences: [
      {
        id: chargeReferenceId,
        chargeVersionId: chargeVersion.id,
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
        id: chargeElementId,
        chargeReferenceId,
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
    ]
  }
}
