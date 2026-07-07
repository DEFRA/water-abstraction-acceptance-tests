import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function (returnVersionData, licence, reference = 9999990) {
  const {
    returnVersions: [returnVersion]
  } = returnVersionData

  const { points } = licence

  const returnRequirementId = generateUUID()

  return {
    returnRequirements: [
      {
        id: returnRequirementId,
        collectionFrequency: 'day',
        reportingFrequency: 'day',
        returnVersionId: returnVersion.id,
        summer: false,
        upload: false,
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 1,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 12,
        siteDescription: 'TANKS ON JUPITER',
        legacyId: reference,
        reference
      }
    ],
    returnRequirementPoints: points.map((point) => {
      return {
        returnRequirementId,
        pointId: point.id
      }
    }),
    returnRequirementPurposes: [
      {
        returnRequirementId,
        externalId: `${regionCode}:${reference}:A:AGR:420`,
        alias: 'SPRAY IRRIGATION STORAGE',
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
          value: '420',
          select: 'id'
        }
      }
    ]
  }
}
