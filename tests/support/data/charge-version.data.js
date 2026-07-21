import { generateUUID } from '../helpers/generate-uuid.js'
import { regionCode } from '../static.lib.js'

export default function (billingAccountData, licenceData) {
  const chargeElementId = generateUUID()
  const chargeReferenceId = generateUUID()
  const chargeVersionId = generateUUID()

  const {
    billingAccounts: [billingAccount]
  } = billingAccountData

  const {
    licences: [licence]
  } = licenceData

  return {
    chargeVersions: [
      {
        id: chargeVersionId,
        licenceId: licence.id,
        licenceRef: licence.licenceRef,
        billingAccountId: billingAccount.id,
        regionCode,
        scheme: 'sroc',
        versionNumber: 100,
        startDate: '2022-04-01',
        status: 'current',
        source: 'wrls',
        changeReasonId: {
          schema: 'water',
          table: 'changeReasons',
          lookup: 'description',
          value: 'Strategic review of charges (SRoC)',
          select: 'changeReasonId'
        }
      }
    ],
    chargeReferences: [
      {
        id: chargeReferenceId,
        chargeVersionId,
        description: 'SROC Charge Reference 01',
        source: 'tidal',
        loss: 'high',
        factorsOverridden: false,
        chargeCategoryId: {
          schema: 'public',
          table: 'chargeCategories',
          lookup: 'reference',
          value: '4.3.1',
          select: 'id'
        },
        adjustments: {
          aggregate: null,
          s126: null,
          s127: true,
          s130: false,
          charge: null,
          winter: false
        },
        waterModel: 'no model',
        volume: 32,
        eiucRegion: 'Southern',
        section127Agreement: true
      }
    ],
    chargeElements: [
      {
        id: chargeElementId,
        chargeReferenceId,
        abstractionPeriodStartDay: 1,
        abstractionPeriodStartMonth: 4,
        abstractionPeriodEndDay: 31,
        abstractionPeriodEndMonth: 3,
        authorisedAnnualQuantity: 32,
        loss: 'high',
        section127Agreement: true,
        description: 'SROC Charge Purpose 01',
        purposeId: {
          schema: 'public',
          table: 'purposes',
          lookup: 'legacyId',
          value: '400',
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
