import chargeVersionsData from './charge-versions.js'

export default function chargeReferences () {
  const { presroc: presrocChargeVersion, sroc: srocChargeVersion } = chargeVersionsData()

  return {
    presroc: _presrocChargeReference(presrocChargeVersion),
    sroc: _srocChargeReference(srocChargeVersion)
  }
}

function _presrocChargeReference (chargeVersion) {
  return {
    id: '69ea7fd9-961b-4d5d-be8b-ecd0e9cc8482',
    chargeVersionId: chargeVersion.id,
    factorsOverridden: false,
    abstractionPeriodStartDay: 1,
    abstractionPeriodStartMonth: 4,
    description: 'PRESROC Charge Reference',
    abstractionPeriodEndDay: 31,
    abstractionPeriodEndMonth: 10,
    authorisedAnnualQuantity: 30,
    billableAnnualQuantity: 25,
    season: 'summer',
    seasonDerived: 'summer',
    source: 'unsupported',
    loss: 'high',
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
      value: '400',
      select: 'id'
    },
    chargeCategoryId: null,
    additionalCharges: {},
    scheme: 'alcs',
    adjustments: null,
    eiucRegion: null,
    section127Agreement: null,
    restrictedSource: false,
    volume: 0
  }
}

function _srocChargeReference (chargeVersion) {
  return {
    id: 'fa3c73d0-0459-41f0-b6cf-0e0758775ca4',
    chargeVersionId: chargeVersion.id,
    description: 'SROC Charge Reference',
    source: 'tidal',
    loss: 'medium',
    factorsOverridden: false,
    chargeCategoryId: {
      schema: 'public',
      table: 'chargeCategories',
      lookup: 'reference',
      value: '4.6.12',
      select: 'id'
    },
    adjustments: {
      aggregate: null,
      s126: null,
      s127: false,
      s130: false,
      charge: null,
      winter: false
    },
    waterModel: 'no model',
    volume: 32,
    eiucRegion: 'Southern',
    section127Agreement: false
  }
}
