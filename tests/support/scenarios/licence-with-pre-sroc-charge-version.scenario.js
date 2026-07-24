import billingAccountData from '../data/billing-account.data.js'
import chargeVersionData from '../data/charge-version.data.js'
import licenceScenario from './licence.scenario.js'
import { generateUUID } from '../helpers/generate-uuid.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with a pre-SRoC charge version'
export const description =
  'Licence with one charge version and reference pre-dating the SRoC scheme, so it can be used to test old charge scheme behaviour'

export default function () {
  const licence = licenceScenario()

  // charge-version.data.js derives the charge version's startDate from the licence's own startDate, so we move it
  // before the start of SRoC to get a pre-SRoC charge version
  licence.licences[0].startDate = '2018-04-01'

  const billingAccount = billingAccountData(licence)
  const chargeVersion = chargeVersionData(billingAccount, licence)
  const chargeReference = _chargeReference(chargeVersion)

  // charge-version.data.js hardcodes the scheme to sroc, so we override it to alcs to match the pre-SRoC start date
  chargeVersion.chargeVersions[0].scheme = 'alcs'

  return mergeByKey(licence, billingAccount, chargeVersion, chargeReference)
}

// charge-reference.data.js is SRoC-only (charge category, adjustments, and a separate charge element), whereas an
// ALCS charge reference is a flatter, older shape with the abstraction period and purpose held directly on the
// reference and no equivalent charge element, so we build it here rather than adapting the shared builder
function _chargeReference(chargeVersionData) {
  const chargeReferenceId = generateUUID()

  const {
    chargeVersions: [chargeVersion]
  } = chargeVersionData

  return {
    chargeReferences: [
      {
        id: chargeReferenceId,
        chargeVersionId: chargeVersion.id,
        factorsOverridden: false,
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        description: 'Test Charge Element!',
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 15.54,
        season: 'all year',
        seasonDerived: 'all year',
        source: 'unsupported',
        loss: 'medium',
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
        },
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: '140',
          select: 'id'
        },
        chargeCategoryId: null,
        additionalCharges: {},
        scheme: 'alcs',
        adjustments: null,
        eiucRegion: null,
        section127Agreement: null,
        restrictedSource: false
      }
    ]
  }
}
