import { generateUUID } from 'water-abstraction-engine/test/generators.js'

import { generateReturnRequirementReference } from '../helpers/generators.helpers.js'
import { isTwoPartTariffPurpose, purposeDescription } from '../helpers/purpose.helpers.js'

export default function (returnVersion, licenceVersionPurpose) {
  const returnRequirementId = generateUUID()
  const siteDescription = purposeDescription(licenceVersionPurpose.purposeId.value)
  const reference = generateReturnRequirementReference()

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
    legacyId: reference,
    reference,
    twoPartTariff: isTwoPartTariffPurpose(licenceVersionPurpose.purposeId.value)
  }
}
