import { generateUUID } from '../helpers/generate-uuid.js'

export default function (returnVersionData, licence) {
  const {
    returnVersions: [returnVersion]
  } = returnVersionData

  const {
    licenceVersionPurposes: [licenceVersionPurpose],
    points
  } = licence

  const returnRequirementId = generateUUID()

  return {
    returnRequirements: [
      {
        id: returnRequirementId,
        collectionFrequency: 'month',
        reportingFrequency: 'month',
        returnVersionId: returnVersion.id,
        summer: false,
        upload: false,
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 1,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 12,
        siteDescription: 'TANKS ON JUPITER',
        legacyId: 9999990,
        reference: 9999990,
        twoPartTariff: false
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
        alias: `TEST RET REQ PURPOSE ${licenceVersionPurpose.purposeId.value}`,
        primaryPurposeId: {
          schema: 'water',
          table: 'purposesPrimary',
          lookup: 'legacyId',
          value: licenceVersionPurpose.primaryPurposeId.value,
          select: 'purposePrimaryId'
        },
        secondaryPurposeId: {
          schema: 'water',
          table: 'purposesSecondary',
          lookup: 'legacyId',
          value: licenceVersionPurpose.secondaryPurposeId.value,
          select: 'purposeSecondaryId'
        },
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: licenceVersionPurpose.purposeId.value,
          select: 'id'
        }
      }
    ]
  }
}
