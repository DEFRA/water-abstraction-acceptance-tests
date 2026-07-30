import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (chargeVersionData, licenceData) {
  const chargeReferenceId = generateUUID()

  const {
    chargeVersions: [chargeVersion]
  } = chargeVersionData

  const {
    licenceVersionPurposes: [licenceVersionPurpose]
  } = licenceData

  // We make an assumption that if the purpose is not 400 (the default), then we have been passed our alternate which
  // is typically 280 (Make-Up Or Top Up Water). Both have a high loss, and assuming non-tidal and the same volume, both
  // would fall under charge category 4.6.1. Obviously, the calling scenario is free to override any of these values.
  const twoPartTariff = licenceVersionPurpose.purposeId.value === '400'
  const description = twoPartTariff ? 'Spray Irrigation - Direct' : 'Make-Up Or Top Up Water'

  return {
    chargeReferences: [
      {
        id: chargeReferenceId,
        chargeVersionId: chargeVersion.id,
        abstractionPeriodStartDay: licenceVersionPurpose.abstractionPeriodStartDay,
        abstractionPeriodStartMonth: licenceVersionPurpose.abstractionPeriodStartMonth,
        abstractionPeriodEndDay: licenceVersionPurpose.abstractionPeriodEndDay,
        abstractionPeriodEndMonth: licenceVersionPurpose.abstractionPeriodEndMonth,
        authorisedAnnualQuantity: convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity),
        season: 'all year',
        seasonDerived: 'all year',
        description: `Test PRESROC charge element 1 - ${description}`,
        source: 'unsupported',
        loss: 'high',
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: licenceVersionPurpose.purposeId.value,
          select: 'id'
        },
        purposePrimaryId: {
          schema: 'public',
          table: 'primaryPurposes',
          lookup: 'legacyId',
          value: 'A',
          select: 'id'
        },
        purposeSecondaryId: {
          schema: 'public',
          table: 'secondaryPurposes',
          lookup: 'legacyId',
          value: 'AGR',
          select: 'id'
        },
        section127Agreement: twoPartTariff,
        scheme: 'alcs',
        restrictedSource: false
      }
    ]
  }
}
