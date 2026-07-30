import { generateUUID } from '../helpers/generate-uuid.js'

export default function (returnVersionData, licenceVersionPurpose, points) {
  const {
    returnVersions: [returnVersion]
  } = returnVersionData

  const returnRequirementId = generateUUID()
  const siteDescription =
    licenceVersionPurpose.purposeId.value === '400' ? 'Spray Irrigation - Direct' : 'Make-Up Or Top Up Water'

  return {
    returnRequirements: [
      {
        id: returnRequirementId,
        collectionFrequency: 'month',
        reportingFrequency: 'month',
        returnVersionId: returnVersion.id,
        summer: false,
        upload: false,
        abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
        abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
        abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
        abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
        siteDescription,
        legacyId: Number(`9999${licenceVersionPurpose.purposeId.value}`),
        reference: Number(`9999${licenceVersionPurpose.purposeId.value}`),
        twoPartTariff: licenceVersionPurpose.purposeId.value === '400'
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
          schema: 'public',
          table: 'primaryPurposes',
          lookup: 'legacyId',
          value: licenceVersionPurpose.primaryPurposeId.value,
          select: 'id'
        },
        secondaryPurposeId: {
          schema: 'public',
          table: 'secondaryPurposes',
          lookup: 'legacyId',
          value: licenceVersionPurpose.secondaryPurposeId.value,
          select: 'id'
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
