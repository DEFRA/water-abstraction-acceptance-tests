import buildBillingAccountEntity from '../../../../tests/support/entities/billing-account.entity.js'
import buildChargeVersionEntity from '../../../../tests/support/entities/charge-version.entity.js'
import buildPresrocChargeVersionEntity from '../../../../tests/support/entities/presroc-charge-version.entity.js'
import ChangeReasonHelper from 'water-abstraction-engine/test/helpers/change-reason.helper.js'
import ChargeCategoryHelper from 'water-abstraction-engine/test/helpers/charge-category.helper.js'
import chargeElementData from '../../../../tests/support/data/charge-element.data.js'
import chargeReferenceData from '../../../../tests/support/data/charge-reference.data.js'
import chargeReferencePresrocData from '../../../../tests/support/data/charge-reference-presroc.data.js'
import licenceAgreementData from '../../../../tests/support/data/licence-agreement.data.js'
import { licenceModel } from './helpers/end-dates.helpers.js'
import { regionOf } from './helpers/regions.helpers.js'
import { srocStartDate } from '../../../../tests/support/default-values.js'
import { formatDateToIso, today } from '../../../../tests/support/helpers/date.helpers.js'
import workflowData from '../../../../tests/support/data/workflow.data.js'

/**
 * Charge the licences
 *
 * Each licence holder is given a billing account. Licences that started before sroc are given an alcs charge version,
 * then live licences are given a sroc charge version, and so are licences that ended after sroc started. A licence with
 * two purposes then has both charged, and the sroc charge references are varied so they are not all alike. Last of all,
 * a few licences are given a section 130U agreement.
 *
 * Where a step takes the next value from a list, it goes back to the start of the list when it runs out.
 *
 * Call this after everything else has been added to the licences.
 *
 * @param {object[]} licenceEntities - the licence entities to charge
 */
export default function charging(licenceEntities) {
  const billingAccountEntities = _billingAccounts(licenceEntities)

  _chargeLicencesFromAlcs(licenceEntities, billingAccountEntities)
  _chargeLiveLicencesFromSroc(licenceEntities, billingAccountEntities)
  _chargeEndedLicencesFromSroc(licenceEntities, billingAccountEntities)
  _chargeBothPurposes(licenceEntities)
  _varySrocReferences(licenceEntities)
  _addOtherAgreements(licenceEntities)
}

/**
 * The billing account for each licence holder, by the id of their company
 *
 * The billing account is for the company and address on the licence's current licence version. Most billing accounts
 * are for one licence and about a quarter are for a few, so every 5th licence is billed to the account of the licence
 * before it instead. A billing account is kept on the first licence billed to it, so it is loaded with it.
 *
 * @private
 */
function _billingAccounts(licenceEntities) {
  const SHARED_BILLING_ACCOUNT_EVERY = 5

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
 * Give every licence that started before the sroc start date an alcs charge version
 *
 * It was brought over from NALD, and ends when the alcs scheme did or when the licence ended. Many brought over from
 * NALD have no charge reference, so 2 in every 5 have no charge reference or billing account. NALD left about a third
 * of the alcs charge versions on licences that ended before the sroc start date with no end date, so every 3rd of those
 * licences has its alcs charge version left open. About half of the alcs charge versions with a charge reference on a
 * licence with two purposes have one for each purpose, so every 2nd of those does.
 *
 * @private
 */
function _chargeLicencesFromAlcs(licenceEntities, billingAccountEntities) {
  const ALCS_REFERENCED = [true, true, false, true, false]
  const OPEN_ALCS_EVERY = 3
  const REFERENCE_EACH_PURPOSE_EVERY = 2

  let alcsCount = 0
  let endedBeforeSrocCount = 0
  let twoPurposeCount = 0

  for (const licenceEntity of licenceEntities) {
    if (licenceEntity.licence.startDate < srocStartDate) {
      const endDate = _endDate(licenceEntity)
      let open = false

      if (endDate && endDate < srocStartDate) {
        open = endedBeforeSrocCount % OPEN_ALCS_EVERY === OPEN_ALCS_EVERY - 1
        endedBeforeSrocCount++
      }

      const referenced = ALCS_REFERENCED[alcsCount % ALCS_REFERENCED.length]
      const licenceVersionPurposes = _currentPurposes(licenceEntity)
      let purposesToReference = null

      if (referenced && licenceVersionPurposes.length === 2) {
        if (twoPurposeCount % REFERENCE_EACH_PURPOSE_EVERY === REFERENCE_EACH_PURPOSE_EVERY - 1) {
          purposesToReference = licenceVersionPurposes
        }

        twoPurposeCount++
      }

      _chargeFromAlcs(
        licenceEntity,
        billingAccountEntities.get(_holderId(licenceEntity)),
        referenced,
        open,
        purposesToReference
      )
      alcsCount++
    }
  }
}

/**
 * Give the live licences a sroc charge version
 *
 * Nearly every live licence has a sroc charge version, so every one except every 18th is given one. A few are
 * non-chargeable, so every 24th of those is made for the next non-chargeable reason in the list, about half of which
 * are transfer type licence. Most licences without a sroc charge version are not in the workflow, so only every 7th of
 * them is waiting for its charge information to be set up.
 *
 * @private
 */
function _chargeLiveLicencesFromSroc(licenceEntities, billingAccountEntities) {
  const NON_CHARGEABLE_EVERY = 24
  const NON_CHARGEABLE_REASONS = [
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(13),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(17),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(21),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(19),
    ChangeReasonHelper.select(20),
    ChangeReasonHelper.select(16)
  ]
  const TO_SET_UP_EVERY = 7
  const UNCHARGED_EVERY = 18

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
}

/**
 * Give the licences that ended after sroc started a sroc charge version
 *
 * A licence that has ended is given one where it started on or after the sroc start date, or expired on or after it.
 *
 * @private
 */
function _chargeEndedLicencesFromSroc(licenceEntities, billingAccountEntities) {
  for (const licenceEntity of licenceEntities) {
    if (
      licenceModel(licenceEntity).$ended() &&
      (licenceEntity.licence.startDate >= srocStartDate || _expiredOnOrAfterSroc(licenceEntity))
    ) {
      _chargeFromSroc(licenceEntity, billingAccountEntities.get(_holderId(licenceEntity)))
    }
  }
}

/**
 * Charge both purposes of the licences with two
 *
 * Each licence with two purposes on its current licence version, and a sroc charge reference, has them charged in the
 * next way from the list. About half have one reference with an element for each purpose, a quarter a reference for
 * each, and a quarter only the first purpose charged. At this point a licence has at most one sroc charge version, with
 * one charge reference, so that is the one charged by purpose.
 *
 * @private
 */
function _chargeBothPurposes(licenceEntities) {
  const PURPOSE_CHARGING = ['elements', 'elements', 'references', 'first only']

  let twoPurposeCount = 0

  for (const licenceEntity of licenceEntities) {
    const licenceVersionPurposes = _currentPurposes(licenceEntity)
    const srocReference = (licenceEntity.chargeReferences ?? []).find((chargeReference) => {
      return chargeReference.scheme === 'sroc'
    })

    if (licenceVersionPurposes.length !== 2 || !srocReference) {
      continue
    }

    _chargeByPurpose(
      licenceEntity,
      srocReference,
      licenceVersionPurposes,
      PURPOSE_CHARGING[twoPurposeCount % PURPOSE_CHARGING.length]
    )
    twoPurposeCount++
  }
}

/**
 * Vary the sroc charge references so they are not all alike
 *
 * Each takes the next loss, water model and whether it is for a restricted source from their lists, then the charge
 * category those and its volume fall in. Most are high loss, about a third medium and a few low; a little over half are
 * restricted; models are spread about evenly. A water company licence's references are for public water supply, and the
 * rest have no additional charges. Every 12th has a winter discount and every 9th an aggregate factor of a half. A
 * few have a charge adjustment, so every 125th has a charge adjustment of a half.
 *
 * @private
 */
function _varySrocReferences(licenceEntities) {
  const AGGREGATE_EVERY = 9
  const CHARGE_ADJUSTMENT_EVERY = 125
  const LOSSES = ['high', 'medium', 'high', 'low', 'high', 'medium', 'high']
  const RESTRICTED_SOURCES = [true, false, true, true, false]
  const WATER_MODELS = ['no model', 'tier 1', 'tier 2']
  const WINTER_DISCOUNT_EVERY = 12

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
      chargeReference.chargeCategoryId.value = _chargeCategory(chargeReference).reference

      if (srocReferenceCount % WINTER_DISCOUNT_EVERY === WINTER_DISCOUNT_EVERY - 1) {
        chargeReference.adjustments.winter = true
      }

      if (srocReferenceCount % AGGREGATE_EVERY === AGGREGATE_EVERY - 1) {
        chargeReference.adjustments.aggregate = '0.5'
      }

      if (srocReferenceCount % CHARGE_ADJUSTMENT_EVERY === CHARGE_ADJUSTMENT_EVERY - 1) {
        chargeReference.adjustments.charge = '0.5'
      }

      srocReferenceCount++
    }
  }
}

/**
 * Give a few licences a section 130U agreement
 *
 * Besides two-part tariff, a few licences have another kind of agreement, most often section 130U, so every 180th
 * licence is given one. It is added to the licence's agreements, so a licence with a two-part tariff agreement keeps
 * that one too. A licence with a section 130 agreement has the section 130 adjustment on its sroc charge references, so
 * each sroc charge reference the licence has is given it.
 *
 * @private
 */
function _addOtherAgreements(licenceEntities) {
  const S130U_EVERY = 180

  for (let i = 0; i < licenceEntities.length; i++) {
    if (i % S130U_EVERY !== S130U_EVERY - 1) {
      continue
    }

    const licenceEntity = licenceEntities[i]
    const licenceAgreement = licenceAgreementData(licenceEntity.licence)

    licenceAgreement.financialAgreementId.value = 'S130U'

    _add(licenceEntity, { licenceAgreement })

    const srocReferences = (licenceEntity.chargeReferences ?? []).filter((chargeReference) => {
      return chargeReference.scheme === 'sroc'
    })

    for (const chargeReference of srocReferences) {
      chargeReference.adjustments.s130 = true
    }
  }
}

/**
 * Give a licence an alcs charge version
 *
 * It was brought over from NALD, and ends when the alcs scheme did, or when the licence ended where that was earlier.
 * Where it is `open` it has no end date, as NALD left it. Where it is not `referenced` the charge reference the entity
 * builds is left out, and so is the billing account, as NALD has neither for it. Where it is given
 * `purposesToReference`, it has a charge reference for each of them in place of the one the entity builds. Where one of
 * the charge references it has is for two-part tariff, the licence is given a two-part tariff (S127) agreement.
 *
 * @private
 */
function _chargeFromAlcs(licenceEntity, billingAccountEntity, referenced, open, purposesToReference) {
  const { chargeVersion, chargeReference } = buildPresrocChargeVersionEntity(
    licenceEntity,
    billingAccountEntity,
    regionOf(licenceEntity).region
  )

  chargeVersion.endDate = open ? null : _alcsEndDate(licenceEntity)
  chargeVersion.source = 'nald'

  let chargeReferences = []

  if (referenced && purposesToReference) {
    chargeReferences = purposesToReference.map((licenceVersionPurpose) => {
      return chargeReferencePresrocData(chargeVersion, licenceVersionPurpose)
    })
  } else if (referenced) {
    chargeReferences = [chargeReference]
  } else {
    chargeVersion.billingAccountId = null
  }

  _add(licenceEntity, { chargeVersion })

  for (const addedChargeReference of chargeReferences) {
    _add(licenceEntity, { chargeReference: addedChargeReference })
  }

  const twoPartTariff = chargeReferences.some((addedChargeReference) => {
    return addedChargeReference.section127Agreement
  })

  if (twoPartTariff) {
    _add(licenceEntity, { licenceAgreement: licenceAgreementData(licenceEntity.licence) })
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

  chargeVersion.changeReasonId.value = reason.description
  chargeVersion.billingAccountId = null

  _add(licenceEntity, { chargeVersion })
}

/**
 * Charge both of a licence's purposes on its sroc charge version
 *
 * The charge version entity builds one charge reference and one charge element, for the purpose the licence was built
 * with (`licenceVersionPurpose`). Where `charging` is 'elements' they are replaced with one charge reference for both
 * purposes, with a charge element for each. Where it is 'references' they are replaced with a charge reference and
 * charge element for each purpose. Where it is 'first only' they are left as they are.
 *
 * @private
 */
function _chargeByPurpose(licenceEntity, chargeReference, licenceVersionPurposes, charging) {
  if (charging === 'first only') {
    return
  }

  const chargeVersion = licenceEntity.chargeVersions.find((srocChargeVersion) => {
    return srocChargeVersion.id === chargeReference.chargeVersionId
  })

  licenceEntity.chargeReferences = licenceEntity.chargeReferences.filter((builtChargeReference) => {
    return builtChargeReference !== chargeReference
  })
  licenceEntity.chargeElements = licenceEntity.chargeElements.filter((chargeElement) => {
    return chargeElement.chargeReferenceId !== chargeReference.id
  })

  if (charging === 'elements') {
    const purposesChargeReference = chargeReferenceData(chargeVersion, licenceVersionPurposes)

    _add(licenceEntity, { chargeReference: purposesChargeReference })

    for (const licenceVersionPurpose of licenceVersionPurposes) {
      _add(licenceEntity, { chargeElement: chargeElementData(purposesChargeReference, licenceVersionPurpose) })
    }

    return
  }

  for (let i = 0; i < licenceVersionPurposes.length; i++) {
    const purposeChargeReference = chargeReferenceData(chargeVersion, [licenceVersionPurposes[i]])

    purposeChargeReference.description = `Test charge reference ${i + 1}`

    _add(licenceEntity, {
      chargeReference: purposeChargeReference,
      chargeElement: chargeElementData(purposeChargeReference, licenceVersionPurposes[i])
    })
  }
}

/**
 * Give a licence a sroc charge version
 *
 * It starts on the sroc start date, or when the licence started where that was later. Where the licence started before
 * the sroc start date, it was made because the licence moved onto sroc. Where the licence has ended, it ends when the
 * licence did.
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
    chargeVersionEntity.chargeVersion.changeReasonId.value = ChangeReasonHelper.select(24).description
  }

  const endDate = _endDate(licenceEntity)

  if (endDate && endDate <= formatDateToIso(today())) {
    chargeVersionEntity.chargeVersion.endDate = endDate
  }

  _add(licenceEntity, chargeVersionEntity)
}

/**
 * Add entities to a licence that it can have more than one of
 *
 * A licence can have more than one charge version, charge reference, charge element and licence agreement, so each is
 * kept in a list named for it, such as `chargeVersions` for a `chargeVersion`. The list is created the first time one
 * is added.
 *
 * @private
 */
function _add(licenceEntity, entities) {
  for (const [key, value] of Object.entries(entities)) {
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
 * The charge category for a sroc charge reference
 *
 * It is the one of the engine's charge categories for a non-tidal source with the reference's loss, water model and
 * restricted source, whose volume band its volume falls in. Where none matches, it throws an error saying what the
 * reference has, rather than leaving the reference without a category.
 *
 * @private
 */
function _chargeCategory(chargeReference) {
  const { loss, restrictedSource, volume, waterModel } = chargeReference

  const chargeCategory = ChargeCategoryHelper.data.find((category) => {
    return (
      !category.tidal &&
      category.lossFactor === loss &&
      category.modelTier === waterModel &&
      category.restrictedSource === restrictedSource &&
      volume > category.minVolume &&
      volume <= category.maxVolume
    )
  })

  if (!chargeCategory) {
    throw new Error(
      `No charge category for a non-tidal ${loss} loss reference with ${waterModel}, restricted source ` +
        `${restrictedSource} and a volume of ${volume}`
    )
  }

  return chargeCategory
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
 * The purposes on the licence's current licence version
 *
 * @private
 */
function _currentPurposes(licenceEntity) {
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes ?? [licenceEntity.licenceVersionPurpose]
  const currentLicenceVersion = _currentLicenceVersion(licenceEntity)

  return licenceVersionPurposes.filter((licenceVersionPurpose) => {
    return licenceVersionPurpose.licenceVersionId === currentLicenceVersion.id
  })
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
