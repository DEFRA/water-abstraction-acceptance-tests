import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (chargeReferenceData, licenceData, noOfElements = 1) {
  const {
    chargeReferences: [chargeReference]
  } = chargeReferenceData

  const {
    licenceVersionPurposes: [licenceVersionPurpose]
  } = licenceData

  // We make an assumption that if the purpose is not 400 (the default), then we have been passed our alternate which
  // is typically 280 (Make-Up Or Top Up Water). Both have a high loss, and assuming non-tidal and the same volume, both
  // would fall under charge category 4.6.1. Obviously, the calling scenario is free to override any of these values.
  const twoPartTariff = licenceVersionPurpose.purposeId.value === '400'
  const description = twoPartTariff ? 'Spray Irrigation - Direct' : 'Make-Up Or Top Up Water'

  return {
    chargeElements: [
      {
        id: generateUUID(),
        chargeReferenceId: chargeReference.id,
        abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
        abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
        abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
        abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
        authorisedAnnualQuantity: convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity / noOfElements),
        loss: 'high',
        section127Agreement: twoPartTariff,
        description,
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: licenceVersionPurpose.purposeId.value,
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
