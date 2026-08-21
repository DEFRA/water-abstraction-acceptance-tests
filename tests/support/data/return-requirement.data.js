import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { isTwoPartTariffPurpose, purposeDescription } from '../helpers/purpose.helpers.js'

export default function (returnVersion, licenceVersionPurpose) {
  const returnRequirementId = generateUUID()
  const siteDescription = purposeDescription(licenceVersionPurpose.purposeId.value)

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
    twoPartTariff: isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
  }
}
