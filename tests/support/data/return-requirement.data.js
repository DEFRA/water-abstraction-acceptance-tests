import { generateUUID } from '../helpers/generate-uuid.js'

export default function (returnVersion, licenceVersionPurpose) {
  const returnRequirementId = generateUUID()
  const siteDescription =
    licenceVersionPurpose.purposeId.value === '400' ? 'Spray Irrigation - Direct' : 'Make-Up Or Top Up Water'

  return {
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
}
