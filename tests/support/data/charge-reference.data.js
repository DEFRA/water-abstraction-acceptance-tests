import { generateUUID } from '../helpers/generate-uuid.js'

export default function (chargeVersionData) {
  const {
    chargeVersions: [chargeVersion]
  } = chargeVersionData

  return {
    chargeReferences: [
      {
        id: generateUUID(),
        chargeVersionId: chargeVersion.id,
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
