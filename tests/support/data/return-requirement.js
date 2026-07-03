import { generateUUID } from '../helpers/generate-uuid.js'

export default function (returnVersionData, pointData) {
  const {
    returnVersions: [returnVersion]
  } = returnVersionData

  const {
    points: [point]
  } = pointData

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
        legacyId: 9999990,
        externalId: '9:9999990'
      }
    ],
    returnRequirementPoints: [
      {
        returnRequirementId,
        pointId: point.id
      }
    ],
    returnRequirementPurposes: [
      {
        returnRequirementId,
        externalId: '6:9999990:A:AGR:420',
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
          value: '140',
          select: 'id'
        }
      }
    ]
  }
}
