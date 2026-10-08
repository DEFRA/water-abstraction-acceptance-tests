import { addCondition } from './helpers/licence/conditions.helpers.js'
import { addPoint } from './helpers/licence/points.helpers.js'
import { addPurpose } from './helpers/licence/purposes.helpers.js'
import buildLicenceEntity from '../../../../tests/support/entities/licence.entity.js'
import { mergeByKey } from '../../../../tests/support/helpers/scenario.helpers.js'
import { regions } from '../../../../tests/support/default-values.js'
import { addPurposeToNewVersion, correct, transfer } from './helpers/licence/licence-versions.helpers.js'
import { expire, expireInFuture, lapse, revoke } from './helpers/licence/end-dates.helpers.js'

/**
 * How many licences of each group to add for each region
 *
 * The groups are by how often a kind of licence is seen. A region's total is in proportion to its size, and is split
 * between the groups the same way in every region.
 */
const REGIONS = [
  { region: regions.ANGLIAN, common: 273, fairlyCommon: 92, uncommon: 128, rare: 61, veryRare: 3 },
  { region: regions.MIDLANDS, common: 215, fairlyCommon: 72, uncommon: 101, rare: 48, veryRare: 2 },
  { region: regions.SOUTH_WEST, common: 156, fairlyCommon: 53, uncommon: 73, rare: 35, veryRare: 1 },
  { region: regions.NORTH_EAST, common: 124, fairlyCommon: 42, uncommon: 58, rare: 28, veryRare: 2 },
  { region: regions.NORTH_WEST, common: 81, fairlyCommon: 27, uncommon: 38, rare: 18, veryRare: 2 },
  { region: regions.THAMES, common: 64, fairlyCommon: 22, uncommon: 30, rare: 14, veryRare: 1 },
  { region: regions.SOUTHERN, common: 44, fairlyCommon: 15, uncommon: 21, rare: 10, veryRare: 1 },
  { region: regions.WALES, common: 27, fairlyCommon: 9, uncommon: 12, rare: 6, veryRare: 1 }
]

// The licences in each group. Each entry is a function that builds one licence for a region.
//
// The kinds of licence in a group are seen about as often as each other, so a group's licences are shared equally
// between its entries. Where one kind is seen more than the rest of its group it is in the list more than once. Each
// list is most common first, so a small region that can not have them all gets the ones seen most.
//
// A live licence either has no end date or expires in the future. About a third of them expire in the future, so about
// a third of the live combinations are built that way.
//
// An ended licence is mostly revoked, but some have expired or lapsed, so a few of the ended combinations are built
// those ways.

// Revoked is seen about four times as often as expired
const COMMON = [_revoked, _revoked, _expired, _revoked, _revoked]

const FAIRLY_COMMON = [_lapsed, _revokedWithOneCondition, _revokedWithTwoVersions, _expiredAndRevoked]

const UNCOMMON = [
  _liveWithTwoVersions,
  _liveWithOneCondition,
  _noEndDate,
  _expiringWithThreeVersions,
  _expiredWithTwoPoints,
  _liveWithFourVersions,
  _expiredWithTwoVersionsAndOneCondition,
  _lapsedWithTwoPurposesAndTwoPoints,
  _expiringWithTwoVersionsAndOneCondition,
  _liveWithFourConditions,
  _revokedWithTwoConditions,
  _revokedWithTwoPurposes,
  _revokedWithTwoPurposesAndFourConditions,
  _expiringWithFourVersionsAndOneCondition,
  _revokedWithThreeVersions
]

const RARE = [
  _expiresInFuture,
  _liveWithThreeVersionsAndOneCondition,
  _expiringWithTwoConditions,
  _liveWithTwoVersionsAndFourConditions,
  _revokedWithThreeConditions,
  _liveWithFourVersionsTwoPurposesAndFourConditions,
  _expiringWithTwoVersionsAndTwoConditions,
  _liveWithFourVersionsAndTwoConditions,
  _expiringWithFourVersionsAndFourConditions,
  _liveWithTwoPurposesAndFourConditions,
  _revokedWithFutureExpiry,
  _liveWithThreeConditions,
  _liveWithTwoVersionsTwoPurposesAndFourConditions,
  _expiringWithThreeVersionsAndTwoConditions,
  _liveWithThreeVersionsAndFourConditions,
  _liveWithFourVersionsAndThreeConditions,
  _liveWithThreeVersionsTwoPurposesAndFourConditions,
  _expiringWithTwoVersionsAndThreeConditions,
  _expiredAndLapsed
]

const VERY_RARE = [_lapsedWithFutureExpiry, _lapsedAndRevoked, _expiredLapsedAndRevoked]

/**
 * Generate the licences that populate the world
 *
 * Each region gets its number of licences from each group. For each one the next function in that group's list builds
 * it, going back to the start of the list when it runs out.
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateLicences() {
  const licenceEntities = []

  for (const { region, common, fairlyCommon, uncommon, rare, veryRare } of REGIONS) {
    for (let i = 0; i < common; i++) {
      licenceEntities.push(COMMON[i % COMMON.length](region))
    }

    for (let i = 0; i < fairlyCommon; i++) {
      licenceEntities.push(FAIRLY_COMMON[i % FAIRLY_COMMON.length](region))
    }

    for (let i = 0; i < uncommon; i++) {
      licenceEntities.push(UNCOMMON[i % UNCOMMON.length](region))
    }

    for (let i = 0; i < rare; i++) {
      licenceEntities.push(RARE[i % RARE.length](region))
    }

    for (let i = 0; i < veryRare; i++) {
      licenceEntities.push(VERY_RARE[i % VERY_RARE.length](region))
    }
  }

  return mergeByKey(...licenceEntities)
}

/**
 * Add licence versions, purposes, points and conditions to a licence
 *
 * `amounts` says how many the licence ends up with. Any that are left out stay as the licence was built: one licence
 * version, one purpose, one point and no conditions.
 *
 * Purposes, points and conditions are added first, so that every licence version has them. Then the licence versions
 * are added, each for a reason: a transfer to a new licence holder, then a correction, then another transfer. Where the
 * licence has more than one version and more than one purpose, the last version is there because a purpose was added.
 *
 * @private
 */
function _add(licenceEntity, region, amounts) {
  const { versions = 1, purposes = 1, points = 1, conditions = 0 } = amounts

  const purposeAddedInLastVersion = versions > 1 && purposes > 1
  const purposesToAddNow = purposeAddedInLastVersion ? purposes - 2 : purposes - 1

  for (let i = 0; i < purposesToAddNow; i++) {
    addPurpose(licenceEntity, region)
  }

  for (let i = 1; i < points; i++) {
    addPoint(licenceEntity, region)
  }

  for (let i = 0; i < conditions; i++) {
    addCondition(licenceEntity)
  }

  const reasons = [transfer, correct, transfer]

  for (let i = 0; i < versions - 1; i++) {
    const lastVersion = i === versions - 2

    if (lastVersion && purposeAddedInLastVersion) {
      addPurposeToNewVersion(licenceEntity, region)
    } else {
      reasons[i](licenceEntity, region)
    }
  }

  return licenceEntity
}

function _expired(region) {
  return expire(buildLicenceEntity(region))
}

function _expiredAndLapsed(region) {
  return lapse(expire(buildLicenceEntity(region)))
}

function _expiredAndRevoked(region) {
  return revoke(expire(buildLicenceEntity(region)))
}

function _expiredLapsedAndRevoked(region) {
  return revoke(lapse(expire(buildLicenceEntity(region))))
}

function _expiresInFuture(region) {
  return expireInFuture(buildLicenceEntity(region))
}

function _lapsed(region) {
  return lapse(buildLicenceEntity(region))
}

function _lapsedAndRevoked(region) {
  return revoke(lapse(buildLicenceEntity(region)))
}

function _lapsedWithFutureExpiry(region) {
  return lapse(expireInFuture(buildLicenceEntity(region)))
}

function _noEndDate(region) {
  return buildLicenceEntity(region)
}

function _revoked(region) {
  return revoke(buildLicenceEntity(region))
}

function _revokedWithFutureExpiry(region) {
  return revoke(expireInFuture(buildLicenceEntity(region)))
}

// A licence with one of the combinations of licence versions, purposes, points and conditions that are really seen.
// Live has no end date and expiring is live with an expiry date in the future. The ended ones are revoked, expired or
// lapsed.

function _revokedWithOneCondition(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { conditions: 1 })
}

function _revokedWithTwoVersions(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { versions: 2 })
}

function _expiredWithTwoPoints(region) {
  return _add(expire(buildLicenceEntity(region)), region, { points: 2 })
}

function _expiredWithTwoVersionsAndOneCondition(region) {
  return _add(expire(buildLicenceEntity(region)), region, { versions: 2, conditions: 1 })
}

function _lapsedWithTwoPurposesAndTwoPoints(region) {
  return _add(lapse(buildLicenceEntity(region)), region, { purposes: 2, points: 2 })
}

function _revokedWithTwoConditions(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { conditions: 2 })
}

function _revokedWithTwoPurposes(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { purposes: 2 })
}

function _revokedWithTwoPurposesAndFourConditions(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { purposes: 2, conditions: 4 })
}

function _revokedWithThreeVersions(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { versions: 3 })
}

function _revokedWithThreeConditions(region) {
  return _add(revoke(buildLicenceEntity(region)), region, { conditions: 3 })
}

function _liveWithTwoVersions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 2 })
}

function _liveWithOneCondition(region) {
  return _add(buildLicenceEntity(region), region, { conditions: 1 })
}

function _expiringWithThreeVersions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 3 })
}

function _liveWithFourVersions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 4 })
}

function _expiringWithTwoVersionsAndOneCondition(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 2, conditions: 1 })
}

function _liveWithFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { conditions: 4 })
}

function _expiringWithFourVersionsAndOneCondition(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 4, conditions: 1 })
}

function _liveWithThreeVersionsAndOneCondition(region) {
  return _add(buildLicenceEntity(region), region, { versions: 3, conditions: 1 })
}

function _expiringWithTwoConditions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { conditions: 2 })
}

function _liveWithTwoVersionsAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 2, conditions: 4 })
}

function _liveWithFourVersionsTwoPurposesAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 4, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndTwoConditions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 2, conditions: 2 })
}

function _liveWithFourVersionsAndTwoConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 4, conditions: 2 })
}

function _expiringWithFourVersionsAndFourConditions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 4, conditions: 4 })
}

function _liveWithTwoPurposesAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { purposes: 2, conditions: 4 })
}

function _liveWithThreeConditions(region) {
  return _add(buildLicenceEntity(region), region, { conditions: 3 })
}

function _liveWithTwoVersionsTwoPurposesAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 2, purposes: 2, conditions: 4 })
}

function _expiringWithThreeVersionsAndTwoConditions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 3, conditions: 2 })
}

function _liveWithThreeVersionsAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 3, conditions: 4 })
}

function _liveWithFourVersionsAndThreeConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 4, conditions: 3 })
}

function _liveWithThreeVersionsTwoPurposesAndFourConditions(region) {
  return _add(buildLicenceEntity(region), region, { versions: 3, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndThreeConditions(region) {
  return _add(expireInFuture(buildLicenceEntity(region)), region, { versions: 2, conditions: 3 })
}
