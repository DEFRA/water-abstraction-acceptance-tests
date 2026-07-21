import { generateUUID } from '../helpers/generate-uuid.js'

export default function (licenceData, pointData) {
  const {
    licenceVersions: [licenceVersion]
  } = licenceData

  const {
    points: [point]
  } = pointData

  const licenceVersionPurposeId = generateUUID()

  return {
    licenceVersionPurposes: [
      {
        id: licenceVersionPurposeId,
        licenceVersionId: licenceVersion.id,
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
        },
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        annualQuantity: 1554,
        externalId: '9:1234'
      }
    ],
    licenceVersionPurposePoints: [
      {
        licenceVersionPurposeId,
        pointId: point.id
      }
    ]
  }
}
