import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { generateUUID } from '../helpers/generate-uuid.js'

export default function (chargeVersionData, licenceData) {
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
        id: generateUUID(),
        chargeVersionId: chargeVersion.id,
        description: `Test charge reference 1 - ${description}`,
        source: 'non-tidal',
        loss: 'high',
        scheme: 'sroc',
        chargeCategoryId: {
          schema: 'public',
          table: 'chargeCategories',
          lookup: 'reference',
          value: '4.6.1',
          select: 'id'
        },
        additionalCharges: {},
        adjustments: {
          aggregate: null,
          s126: null,
          s127: twoPartTariff,
          s130: false,
          charge: null,
          winter: false
        },
        restrictedSource: false,
        waterModel: 'no model',
        volume: convertCubicMetresToMegalitres(licenceVersionPurpose.annualQuantity),
        eiucRegion: 'Southern',
        section127Agreement: twoPartTariff
      }
    ]
  }
}
