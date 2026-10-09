import { addCondition } from './helpers/licence/conditions.helpers.js'
import { addPoint } from './helpers/licence/points.helpers.js'
import { addPurpose } from './helpers/licence/purposes.helpers.js'
import buildLicenceEntity from '../../../../tests/support/entities/licence.entity.js'
import { mergeByKey } from '../../../../tests/support/helpers/scenario.helpers.js'
import { regions } from '../../../../tests/support/default-values.js'
import { addPurposeToNewVersion, correct, transfer } from './helpers/licence/licence-versions.helpers.js'
import { expire, expireInFuture, lapse, revoke } from './helpers/licence/end-dates.helpers.js'
import { startOn } from './helpers/licence/start-dates.helpers.js'

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

// The dates the licences start on. Each licence takes the next one, going back to the start of the list when it runs
// out.
//
// About half of all licences started in the 1960s, so about half of the dates are. The rest are shared between the
// decades since in proportion. The list is a different length to any of the groups below, so a kind of licence is not
// always given the same start dates.
const START_DATES = [
  '1965-04-01',
  '1972-04-01',
  '1966-04-01',
  '1994-04-01',
  '1963-04-01',
  '1985-04-01',
  '1967-04-01',
  '2004-04-01',
  '1961-04-01',
  '2013-04-01',
  '1968-04-01',
  '1991-04-01',
  '1964-04-01',
  '1978-04-01',
  '1969-04-01',
  '2022-04-01',
  '1962-04-01',
  '1988-04-01',
  '1960-04-01',
  '2008-04-01',
  '1965-04-01',
  '1997-04-01',
  '2017-04-01'
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
 * it, going back to the start of the list when it runs out. Each licence is given the next start date in the same way.
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateLicences() {
  const licenceEntities = []

  for (const { region, common, fairlyCommon, uncommon, rare, veryRare } of REGIONS) {
    for (let i = 0; i < common; i++) {
      licenceEntities.push(COMMON[i % COMMON.length](region, _startDate(licenceEntities)))
    }

    for (let i = 0; i < fairlyCommon; i++) {
      licenceEntities.push(FAIRLY_COMMON[i % FAIRLY_COMMON.length](region, _startDate(licenceEntities)))
    }

    for (let i = 0; i < uncommon; i++) {
      licenceEntities.push(UNCOMMON[i % UNCOMMON.length](region, _startDate(licenceEntities)))
    }

    for (let i = 0; i < rare; i++) {
      licenceEntities.push(RARE[i % RARE.length](region, _startDate(licenceEntities)))
    }

    for (let i = 0; i < veryRare; i++) {
      licenceEntities.push(VERY_RARE[i % VERY_RARE.length](region, _startDate(licenceEntities)))
    }
  }

  return mergeByKey(...licenceEntities)
}

/**
 * Build a licence that starts on the given date
 *
 * @private
 */
function _build(region, startDate) {
  return startOn(buildLicenceEntity(region), startDate)
}

/**
 * The start date for the next licence, which is the next in the list after the one the last licence was given
 *
 * @private
 */
function _startDate(licenceEntities) {
  return START_DATES[licenceEntities.length % START_DATES.length]
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

function _expired(region, startDate) {
  return expire(_build(region, startDate))
}

function _expiredAndLapsed(region, startDate) {
  return lapse(expire(_build(region, startDate)))
}

function _expiredAndRevoked(region, startDate) {
  return revoke(expire(_build(region, startDate)))
}

function _expiredLapsedAndRevoked(region, startDate) {
  return revoke(lapse(expire(_build(region, startDate))))
}

function _expiresInFuture(region, startDate) {
  return expireInFuture(_build(region, startDate))
}

function _lapsed(region, startDate) {
  return lapse(_build(region, startDate))
}

function _lapsedAndRevoked(region, startDate) {
  return revoke(lapse(_build(region, startDate)))
}

function _lapsedWithFutureExpiry(region, startDate) {
  return lapse(expireInFuture(_build(region, startDate)))
}

function _noEndDate(region, startDate) {
  return _build(region, startDate)
}

function _revoked(region, startDate) {
  return revoke(_build(region, startDate))
}

function _revokedWithFutureExpiry(region, startDate) {
  return revoke(expireInFuture(_build(region, startDate)))
}

// A licence with one of the combinations of licence versions, purposes, points and conditions that are really seen.
// Live has no end date and expiring is live with an expiry date in the future. The ended ones are revoked, expired or
// lapsed.

function _revokedWithOneCondition(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { conditions: 1 })
}

function _revokedWithTwoVersions(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { versions: 2 })
}

function _expiredWithTwoPoints(region, startDate) {
  return _add(expire(_build(region, startDate)), region, { points: 2 })
}

function _expiredWithTwoVersionsAndOneCondition(region, startDate) {
  return _add(expire(_build(region, startDate)), region, { versions: 2, conditions: 1 })
}

function _lapsedWithTwoPurposesAndTwoPoints(region, startDate) {
  return _add(lapse(_build(region, startDate)), region, { purposes: 2, points: 2 })
}

function _revokedWithTwoConditions(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { conditions: 2 })
}

function _revokedWithTwoPurposes(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { purposes: 2 })
}

function _revokedWithTwoPurposesAndFourConditions(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { purposes: 2, conditions: 4 })
}

function _revokedWithThreeVersions(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { versions: 3 })
}

function _revokedWithThreeConditions(region, startDate) {
  return _add(revoke(_build(region, startDate)), region, { conditions: 3 })
}

function _liveWithTwoVersions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 2 })
}

function _liveWithOneCondition(region, startDate) {
  return _add(_build(region, startDate), region, { conditions: 1 })
}

function _expiringWithThreeVersions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 3 })
}

function _liveWithFourVersions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 4 })
}

function _expiringWithTwoVersionsAndOneCondition(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 2, conditions: 1 })
}

function _liveWithFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { conditions: 4 })
}

function _expiringWithFourVersionsAndOneCondition(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 4, conditions: 1 })
}

function _liveWithThreeVersionsAndOneCondition(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 3, conditions: 1 })
}

function _expiringWithTwoConditions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { conditions: 2 })
}

function _liveWithTwoVersionsAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 2, conditions: 4 })
}

function _liveWithFourVersionsTwoPurposesAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 4, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndTwoConditions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 2, conditions: 2 })
}

function _liveWithFourVersionsAndTwoConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 4, conditions: 2 })
}

function _expiringWithFourVersionsAndFourConditions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 4, conditions: 4 })
}

function _liveWithTwoPurposesAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { purposes: 2, conditions: 4 })
}

function _liveWithThreeConditions(region, startDate) {
  return _add(_build(region, startDate), region, { conditions: 3 })
}

function _liveWithTwoVersionsTwoPurposesAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 2, purposes: 2, conditions: 4 })
}

function _expiringWithThreeVersionsAndTwoConditions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 3, conditions: 2 })
}

function _liveWithThreeVersionsAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 3, conditions: 4 })
}

function _liveWithFourVersionsAndThreeConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 4, conditions: 3 })
}

function _liveWithThreeVersionsTwoPurposesAndFourConditions(region, startDate) {
  return _add(_build(region, startDate), region, { versions: 3, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndThreeConditions(region, startDate) {
  return _add(expireInFuture(_build(region, startDate)), region, { versions: 2, conditions: 3 })
}
