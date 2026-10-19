import buildBillingAccountEntity from '../../../../tests/support/entities/billing-account.entity.js'
import buildChargeVersionEntity from '../../../../tests/support/entities/charge-version.entity.js'
import buildPresrocChargeVersionEntity from '../../../../tests/support/entities/presroc-charge-version.entity.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { srocStartDate } from '../../../../tests/support/default-values.js'
import { formatDateToIso, today } from '../../../../tests/support/helpers/date.helpers.js'
import workflowData from '../../../../tests/support/data/workflow.data.js'

// Whether an alcs charge version has a charge reference. Each alcs charge version takes the next one, going back to
// the start of the list when it runs out.
//
// Many alcs charge versions brought over from NALD have no charge reference, so 2 in every 5 do not.
const ALCS_REFERENCED = [true, true, false, true, false]

// How often a sroc charge reference has an aggregate factor of a half. Every 9th does, starting with the 9th.
const AGGREGATE_EVERY = 9

// How much of what a sroc charge reference abstracts is lost. Each sroc charge reference takes the next one, going back
// to the start of the list when it runs out.
//
// Most are high loss, about a third are medium, and a few are low, so the list is weighted that way.
const LOSSES = ['high', 'medium', 'high', 'low', 'high', 'medium', 'high']

// How often a live licence that is charged is given a non-chargeable sroc charge version instead. Every 24th is,
// starting with the 24th.
//
// A few sroc charge versions are non-chargeable, made for a reason the licence is not charged.
const NON_CHARGEABLE_EVERY = 24

// The reasons a sroc charge version is non-chargeable. Each non-chargeable charge version takes the next one, going
// back to the start of the list when it runs out.
//
// About half are because the licence is a transfer type licence, so every other reason is.
const NON_CHARGEABLE_REASONS = [
  'Transfer type licence',
  'Held by Environment Agency',
  'Transfer type licence',
  'Power generation less than 5 megawatts (S125)',
  'Transfer type licence',
  'Held by Environment Agency',
  'Transfer type licence',
  'Temporary type licence',
  'Transfer type licence',
  'Abatement (S126)'
]

// Whether a sroc charge reference is for a restricted source. Each sroc charge reference takes the next one, going back
// to the start of the list when it runs out.
//
// A little over half are, so 3 in every 5 are.
const RESTRICTED_SOURCES = [true, false, true, true, false]

// How often a licence is billed to the billing account of the licence before it, rather than one of its own. Every 5th
// licence is, starting with the 5th.
//
// Most billing accounts are for one licence, and about a quarter are for a few.
const SHARED_BILLING_ACCOUNT_EVERY = 5

// How often a live licence left without a sroc charge version is in the workflow waiting for it to be set up. Every 7th
// is, starting with the 7th.
//
// Most licences without one are not in the workflow, so only a few are.
const TO_SET_UP_EVERY = 7

// How often a live licence is left without a sroc charge version. Every 18th live licence is, starting with its 18th.
//
// Nearly every live licence has a sroc charge version, but a few have not been given one yet.
const UNCHARGED_EVERY = 18

// The water resource model a sroc charge reference is in. Each sroc charge reference takes the next one, going back to
// the start of the list when it runs out.
//
// They are spread about evenly between no model, tier 1 and tier 2.
const WATER_MODELS = ['no model', 'tier 1', 'tier 2']

// How often a sroc charge reference has a winter discount. Every 12th does, starting with the 12th.
const WINTER_DISCOUNT_EVERY = 12

/**
 * Charge the licences
 *
 * Each licence holder is given a billing account, except that every 5th licence is billed to the account of the
 * licence before it. Licences with the same current licence holder, such as a region's water company licences, are
 * billed to the same billing account.
 *
 * Every licence that started before the sroc start date is given an alcs charge version brought over from NALD, which
 * ends when the alcs scheme did or when the licence ended. 2 in every 5 have no charge reference or billing account.
 *
 * Every live licence, except every 18th, is given a sroc charge version, and every 24th of those is non-chargeable, made
 * for the next reason in the list with no charge reference or billing account. Every 7th of those left without one is
 * in the workflow waiting for its charge information to be set up. A licence that has ended is also given a sroc charge
 * version where it started on or after the sroc start date, or expired on or after it. A sroc charge version starts on
 * the sroc start date, or when the licence started where that was later, and ends when the licence ended. Where the
 * licence started before the sroc start date, it was made because the licence moved onto sroc.
 *
 * The charge versions are built by the charge version entities, so each has the reference, and for sroc the element,
 * those build for the licence's purpose. Each sroc reference takes the next loss, water model and whether it is for a
 * restricted source from their lists. A water company licence's sroc references are for public water supply, and the
 * rest have no additional charges. Every 12th sroc reference has a winter discount and every 9th an aggregate factor
 * of a half.
 *
 * Call this after everything else has been added to the licences.
 *
 * @param {object[]} licenceEntities - the licence entities to charge
 */
export default function charging(licenceEntities) {
  const billingAccountEntities = _billingAccounts(licenceEntities)

  let alcsCount = 0

  for (const licenceEntity of licenceEntities) {
    if (licenceEntity.licence.startDate < srocStartDate) {
      _chargeFromAlcs(
        licenceEntity,
        billingAccountEntities.get(_holderId(licenceEntity)),
        ALCS_REFERENCED[alcsCount % ALCS_REFERENCED.length]
      )
      alcsCount++
    }
  }

  const liveLicenceEntities = licenceEntities.filter((licenceEntity) => {
    return !licenceModel(licenceEntity).$ended()
  })

  let chargedCount = 0
  let nonChargeableCount = 0
  let unchargedCount = 0

  for (let i = 0; i < liveLicenceEntities.length; i++) {
    const billingAccountEntity = billingAccountEntities.get(_holderId(liveLicenceEntities[i]))

    if (i % UNCHARGED_EVERY !== UNCHARGED_EVERY - 1) {
      if (chargedCount % NON_CHARGEABLE_EVERY === NON_CHARGEABLE_EVERY - 1) {
        _chargeAsNonChargeable(
          liveLicenceEntities[i],
          billingAccountEntity,
          NON_CHARGEABLE_REASONS[nonChargeableCount % NON_CHARGEABLE_REASONS.length]
        )
        nonChargeableCount++
      } else {
        _chargeFromSroc(liveLicenceEntities[i], billingAccountEntity)
      }

      chargedCount++

      continue
    }

    if (unchargedCount % TO_SET_UP_EVERY === TO_SET_UP_EVERY - 1) {
      _toSetUp(liveLicenceEntities[i])
    }

    unchargedCount++
  }

  for (const licenceEntity of licenceEntities) {
    if (
      licenceModel(licenceEntity).$ended() &&
      (licenceEntity.licence.startDate >= srocStartDate || _expiredOnOrAfterSroc(licenceEntity))
    ) {
      _chargeFromSroc(licenceEntity, billingAccountEntities.get(_holderId(licenceEntity)))
    }
  }

  let srocReferenceCount = 0

  for (const licenceEntity of licenceEntities) {
    const srocReferences = (licenceEntity.chargeReferences ?? []).filter((chargeReference) => {
      return chargeReference.scheme === 'sroc'
    })

    for (const chargeReference of srocReferences) {
      chargeReference.additionalCharges = licenceEntity.licence.waterUndertaker ? { isSupplyPublicWater: true } : null
      chargeReference.loss = LOSSES[srocReferenceCount % LOSSES.length]
      chargeReference.restrictedSource = RESTRICTED_SOURCES[srocReferenceCount % RESTRICTED_SOURCES.length]
      chargeReference.waterModel = WATER_MODELS[srocReferenceCount % WATER_MODELS.length]

      if (srocReferenceCount % WINTER_DISCOUNT_EVERY === WINTER_DISCOUNT_EVERY - 1) {
        chargeReference.adjustments.winter = true
      }

      if (srocReferenceCount % AGGREGATE_EVERY === AGGREGATE_EVERY - 1) {
        chargeReference.adjustments.aggregate = '0.5'
      }

      srocReferenceCount++
    }
  }
}

/**
 * The billing account for each licence holder, by the id of their company
 *
 * The billing account is for the company and address on the licence's current licence version. Every 5th licence is
 * billed to the account of the licence before it instead. A billing account is kept on the first licence billed to it,
 * so it is loaded with it.
 *
 * @private
 */
function _billingAccounts(licenceEntities) {
  const billingAccountEntities = new Map()

  for (let i = 0; i < licenceEntities.length; i++) {
    const licenceEntity = licenceEntities[i]
    const holderId = _holderId(licenceEntity)

    if (billingAccountEntities.has(holderId)) {
      continue
    }

    if (i % SHARED_BILLING_ACCOUNT_EVERY === SHARED_BILLING_ACCOUNT_EVERY - 1) {
      billingAccountEntities.set(holderId, billingAccountEntities.get(_holderId(licenceEntities[i - 1])))

      continue
    }

    // A water company licence gives up its own company for the water company's, so the entity is given the current
    // licence holder's company and address rather than reading them from the licence
    const { addressId, companyId } = _currentLicenceVersion(licenceEntity)
    const billingAccountEntity = buildBillingAccountEntity(
      { company: { id: companyId }, address: { id: addressId } },
      regionOf(licenceEntity).region
    )

    licenceEntity.billingAccount = billingAccountEntity.billingAccount
    licenceEntity.billingAccountAddress = billingAccountEntity.billingAccountAddress

    billingAccountEntities.set(holderId, billingAccountEntity)
  }

  return billingAccountEntities
}

/**
 * Give a licence an alcs charge version
 *
 * It was brought over from NALD, and ends when the alcs scheme did, or when the licence ended where that was earlier.
 * Where it is not `referenced` the charge reference the entity builds is left out, and so is the billing account, as
 * NALD has neither for it. Where the licence is for a two-part tariff purpose it also has the licence agreement the
 * entity builds for it.
 *
 * @private
 */
function _chargeFromAlcs(licenceEntity, billingAccountEntity, referenced) {
  const { chargeVersion, chargeReference, licenceAgreement } = buildPresrocChargeVersionEntity(
    licenceEntity,
    billingAccountEntity,
    regionOf(licenceEntity).region
  )

  chargeVersion.endDate = _alcsEndDate(licenceEntity)
  chargeVersion.source = 'nald'

  if (referenced) {
    _add(licenceEntity, { chargeVersion, chargeReference })
  } else {
    chargeVersion.billingAccountId = null

    _add(licenceEntity, { chargeVersion })
  }

  if (licenceAgreement.licenceRef) {
    licenceEntity.licenceAgreement = licenceAgreement
  }
}

/**
 * Give a licence a non-chargeable sroc charge version
 *
 * It starts on the sroc start date, or when the licence started where that was later. It is made for the given
 * non-chargeable `reason`, so it has no charge reference, charge element or billing account.
 *
 * @private
 */
function _chargeAsNonChargeable(licenceEntity, billingAccountEntity, reason) {
  const { chargeVersion } = buildChargeVersionEntity(
    licenceEntity,
    billingAccountEntity,
    regionOf(licenceEntity).region
  )

  if (licenceEntity.licence.startDate < srocStartDate) {
    chargeVersion.startDate = srocStartDate
  }

  chargeVersion.changeReasonId.value = reason
  chargeVersion.billingAccountId = null

  _add(licenceEntity, { chargeVersion })
}

/**
 * Give a licence a sroc charge version
 *
 * It starts on the sroc start date, or when the licence started where that was later, in which case it was made because
 * the licence moved onto sroc. Where the licence has ended, it ends when the licence did.
 *
 * @private
 */
function _chargeFromSroc(licenceEntity, billingAccountEntity) {
  const chargeVersionEntity = buildChargeVersionEntity(
    licenceEntity,
    billingAccountEntity,
    regionOf(licenceEntity).region
  )

  if (licenceEntity.licence.startDate < srocStartDate) {
    chargeVersionEntity.chargeVersion.startDate = srocStartDate
    chargeVersionEntity.chargeVersion.changeReasonId.value = 'Strategic review of charges (SRoC)'
  }

  const endDate = _endDate(licenceEntity)

  if (endDate && endDate <= formatDateToIso(today())) {
    chargeVersionEntity.chargeVersion.endDate = endDate
  }

  _add(licenceEntity, chargeVersionEntity)
}

/**
 * Add a charge version entity to a licence
 *
 * A licence can have both an alcs and a sroc charge version, so they are kept in lists, which are created the first
 * time one is added.
 *
 * @private
 */
function _add(licenceEntity, chargeVersionEntity) {
  for (const [key, value] of Object.entries(chargeVersionEntity)) {
    const listKey = `${key}s`

    licenceEntity[listKey] ??= []
    licenceEntity[listKey].push(value)
  }
}

/**
 * The date a licence's alcs charge version ends, which is the day before sroc started, or when the licence ended where
 * that was earlier
 *
 * @private
 */
function _alcsEndDate(licenceEntity) {
  const endDate = _endDate(licenceEntity)

  if (endDate && endDate < srocStartDate) {
    return endDate
  }

  const alcsEndDate = new Date(srocStartDate)

  alcsEndDate.setUTCDate(alcsEndDate.getUTCDate() - 1)

  return formatDateToIso(alcsEndDate)
}

/**
 * The licence's current licence version, which is the last one where it has more than one
 *
 * @private
 */
function _currentLicenceVersion(licenceEntity) {
  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]

  return licenceVersions.at(-1)
}

/**
 * The date a licence ended or will end, which is the earliest of when it expired, lapsed and was revoked
 *
 * @private
 */
function _endDate(licenceEntity) {
  const ends = licenceModel(licenceEntity).$ends()

  return ends ? formatDateToIso(ends.date) : null
}

/**
 * Whether a licence has expired, and did so on or after the sroc start date, without having lapsed or been revoked
 *
 * @private
 */
function _expiredOnOrAfterSroc(licenceEntity) {
  const { expiredDate, lapsedDate, revokedDate } = licenceEntity.licence

  if (revokedDate || lapsedDate || !expiredDate) {
    return false
  }

  return expiredDate >= srocStartDate && expiredDate <= formatDateToIso(today())
}

/**
 * The id of the company that is a licence's current licence holder, from its current licence version
 *
 * @private
 */
function _holderId(licenceEntity) {
  return _currentLicenceVersion(licenceEntity).companyId
}

/**
 * Put a licence in the workflow waiting for its charge information to be set up
 *
 * It is for the licence's current licence version. Nobody has started on it yet, so it has no charge version and was
 * not created by anyone.
 *
 * @private
 */
function _toSetUp(licenceEntity) {
  const workflow = workflowData(licenceEntity.licence)

  workflow.status = 'to_setup'
  workflow.licenceVersionId = _currentLicenceVersion(licenceEntity).id
  workflow.createdBy = null
  workflow.data = { chargeVersion: null, chargeVersionExists: false }

  licenceEntity.workflow = workflow
}
