import buildBillingAccountEntity from '../../../../tests/support/entities/billing-account.entity.js'
import buildChargeVersionEntity from '../../../../tests/support/entities/charge-version.entity.js'
import buildPresrocChargeVersionEntity from '../../../../tests/support/entities/presroc-charge-version.entity.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { srocStartDate } from '../../../../tests/support/default-values.js'
import { formatDateToIso, today } from '../../../../tests/support/helpers/date.helpers.js'

// Whether an alcs charge version has a charge reference. Each alcs charge version takes the next one, going back to
// the start of the list when it runs out.
//
// Many alcs charge versions brought over from NALD have no charge reference, so 2 in every 5 do not.
const ALCS_REFERENCED = [true, true, false, true, false]

// How often a sroc charge reference has an aggregate factor of a half. Every 9th does, starting with the 9th.
const AGGREGATE_EVERY = 9

// How often a licence is billed to the billing account of the licence before it, rather than one of its own. Every 5th
// licence is, starting with the 5th.
//
// Most billing accounts are for one licence, and about a quarter are for a few.
const SHARED_BILLING_ACCOUNT_EVERY = 5

// How often a live licence is left without a sroc charge version. Every 18th live licence is, starting with its 18th.
//
// Nearly every live licence has a sroc charge version, but a few have not been given one yet.
const UNCHARGED_EVERY = 18

// How often a sroc charge reference has a winter discount. Every 12th does, starting with the 12th.
const WINTER_DISCOUNT_EVERY = 12

/**
 * Charge the licences
 *
 * Each licence holder is given a billing account, except that every 5th licence is billed to the account of the
 * licence before it. Licences with the same current licence holder, such as a region's water company licences, are
 * billed to the same billing account.
 *
 * Every licence that started before the sroc start date is given an alcs charge version, which ends when the alcs
 * scheme did or when the licence ended. 2 in every 5 have no charge reference.
 *
 * Every live licence, except every 18th, is given a sroc charge version, and so is a licence that has ended where it
 * started on or after the sroc start date, or expired on or after it. A sroc charge version starts on the sroc start
 * date, or when the licence started where that was later, and ends when the licence ended. Where the licence started
 * before the sroc start date, it was made because the licence moved onto sroc.
 *
 * The charge versions are built by the charge version entities, so each has the reference, and for sroc the element,
 * those build for the licence's purpose. Every 12th sroc reference has a winter discount and every 9th an aggregate
 * factor of a half.
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

  for (let i = 0; i < liveLicenceEntities.length; i++) {
    if (i % UNCHARGED_EVERY !== UNCHARGED_EVERY - 1) {
      _chargeFromSroc(liveLicenceEntities[i], billingAccountEntities.get(_holderId(liveLicenceEntities[i])))
    }
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
 * It ends when the alcs scheme did, or when the licence ended where that was earlier. Where it is not `referenced` the
 * charge reference the entity builds is left out. Where the licence is for a two-part tariff purpose it also has the
 * licence agreement the entity builds for it.
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

  if (referenced) {
    _add(licenceEntity, { chargeVersion, chargeReference })
  } else {
    _add(licenceEntity, { chargeVersion })
  }

  if (licenceAgreement.licenceRef) {
    licenceEntity.licenceAgreement = licenceAgreement
  }
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
