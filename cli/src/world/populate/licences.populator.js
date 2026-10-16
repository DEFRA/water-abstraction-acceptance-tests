import { addCondition } from './helpers/conditions.helpers.js'
import buildLicenceEntity from '../../../../tests/support/entities/licence.entity.js'
import { startOn } from './helpers/start-dates.helpers.js'
import { REGIONS } from './helpers/regions.helpers.js'
import { addPoint } from './helpers/points.helpers.js'
import { addPurpose, usedFor } from './helpers/purposes.helpers.js'
import { addPurposeToNewVersion, correct, firstIssue, transfer } from './helpers/licence-versions.helpers.js'
import { expire, expireInFuture, lapse, revoke } from './helpers/end-dates.helpers.js'

// Licences that started before this date have a first licence version with an issue of 100. Those that started on or
// after it have one with an issue of 1.
const ISSUE_100_BEFORE = '2000-01-01'

// The dates the licences start on. Each licence takes the next one, going back to the start of the list when it runs
// out.
//
// About half of all licences started in the 1960s, so about half of the dates are. The rest are shared between the
// decades since in proportion. The list is a different length to any of the groups of licences, so a kind of licence
// is not always given the same start dates.
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

// The purposes the licences are used for. Each licence takes the next one, going back to the start of the list when it
// runs out.
//
// About two thirds of licences are not two-part tariff, so about two thirds of the purposes are general farming and
// domestic (140), which is not. The rest are spray irrigation direct (400), which is. The list is a different length to
// the start dates and to any of the groups of licences, so a kind of licence is not always given the same purpose.
const PURPOSES = ['140', '140', '400', '140', '140', '400', '140', '400', '140', '140', '400']

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
 * Build the licences that populate the world
 *
 * Each region gets its number of licences from each group. For each one the next function in that group's list builds
 * it, going back to the start of the list when it runs out. Each licence is given the next start date and the next
 * purpose in the same way.
 *
 * @returns {object[]} the licence entities
 */
export default function licences() {
  const licenceEntities = []

  for (const { region, common, fairlyCommon, uncommon, rare, veryRare } of REGIONS) {
    for (let i = 0; i < common; i++) {
      licenceEntities.push(COMMON[i % COMMON.length](region, _startDate(licenceEntities), _purpose(licenceEntities)))
    }

    for (let i = 0; i < fairlyCommon; i++) {
      licenceEntities.push(
        FAIRLY_COMMON[i % FAIRLY_COMMON.length](region, _startDate(licenceEntities), _purpose(licenceEntities))
      )
    }

    for (let i = 0; i < uncommon; i++) {
      licenceEntities.push(
        UNCOMMON[i % UNCOMMON.length](region, _startDate(licenceEntities), _purpose(licenceEntities))
      )
    }

    for (let i = 0; i < rare; i++) {
      licenceEntities.push(RARE[i % RARE.length](region, _startDate(licenceEntities), _purpose(licenceEntities)))
    }

    for (let i = 0; i < veryRare; i++) {
      licenceEntities.push(
        VERY_RARE[i % VERY_RARE.length](region, _startDate(licenceEntities), _purpose(licenceEntities))
      )
    }
  }

  return licenceEntities
}

/**
 * Build a licence that starts on the given date and is used for the given purpose
 *
 * Where the licence started before 2000 its first licence version is issue 100. Otherwise it is issue 1.
 *
 * @private
 */
function _build(region, startDate, purpose) {
  const licenceEntity = usedFor(startOn(buildLicenceEntity(region), startDate), purpose)

  if (startDate < ISSUE_100_BEFORE) {
    firstIssue(licenceEntity, 100)
  }

  return licenceEntity
}

/**
 * The purpose for the next licence, which is the next in the list after the one the last licence was given
 *
 * @private
 */
function _purpose(licenceEntities) {
  return PURPOSES[licenceEntities.length % PURPOSES.length]
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

function _expired(region, startDate, purpose) {
  return expire(_build(region, startDate, purpose))
}

function _expiredAndLapsed(region, startDate, purpose) {
  return lapse(expire(_build(region, startDate, purpose)))
}

function _expiredAndRevoked(region, startDate, purpose) {
  return revoke(expire(_build(region, startDate, purpose)))
}

function _expiredLapsedAndRevoked(region, startDate, purpose) {
  return revoke(lapse(expire(_build(region, startDate, purpose))))
}

function _expiresInFuture(region, startDate, purpose) {
  return expireInFuture(_build(region, startDate, purpose))
}

function _lapsed(region, startDate, purpose) {
  return lapse(_build(region, startDate, purpose))
}

function _lapsedAndRevoked(region, startDate, purpose) {
  return revoke(lapse(_build(region, startDate, purpose)))
}

function _lapsedWithFutureExpiry(region, startDate, purpose) {
  return lapse(expireInFuture(_build(region, startDate, purpose)))
}

function _noEndDate(region, startDate, purpose) {
  return _build(region, startDate, purpose)
}

function _revoked(region, startDate, purpose) {
  return revoke(_build(region, startDate, purpose))
}

function _revokedWithFutureExpiry(region, startDate, purpose) {
  return revoke(expireInFuture(_build(region, startDate, purpose)))
}

// A licence with one of the combinations of licence versions, purposes, points and conditions that are really seen.
// Live has no end date and expiring is live with an expiry date in the future. The ended ones are revoked, expired or
// lapsed.

function _revokedWithOneCondition(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { conditions: 1 })
}

function _revokedWithTwoVersions(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { versions: 2 })
}

function _expiredWithTwoPoints(region, startDate, purpose) {
  return _add(expire(_build(region, startDate, purpose)), region, { points: 2 })
}

function _expiredWithTwoVersionsAndOneCondition(region, startDate, purpose) {
  return _add(expire(_build(region, startDate, purpose)), region, { versions: 2, conditions: 1 })
}

function _lapsedWithTwoPurposesAndTwoPoints(region, startDate, purpose) {
  return _add(lapse(_build(region, startDate, purpose)), region, { purposes: 2, points: 2 })
}

function _revokedWithTwoConditions(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { conditions: 2 })
}

function _revokedWithTwoPurposes(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { purposes: 2 })
}

function _revokedWithTwoPurposesAndFourConditions(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { purposes: 2, conditions: 4 })
}

function _revokedWithThreeVersions(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { versions: 3 })
}

function _revokedWithThreeConditions(region, startDate, purpose) {
  return _add(revoke(_build(region, startDate, purpose)), region, { conditions: 3 })
}

function _liveWithTwoVersions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 2 })
}

function _liveWithOneCondition(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { conditions: 1 })
}

function _expiringWithThreeVersions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 3 })
}

function _liveWithFourVersions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 4 })
}

function _expiringWithTwoVersionsAndOneCondition(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 2, conditions: 1 })
}

function _liveWithFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { conditions: 4 })
}

function _expiringWithFourVersionsAndOneCondition(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 4, conditions: 1 })
}

function _liveWithThreeVersionsAndOneCondition(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 3, conditions: 1 })
}

function _expiringWithTwoConditions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { conditions: 2 })
}

function _liveWithTwoVersionsAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 2, conditions: 4 })
}

function _liveWithFourVersionsTwoPurposesAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 4, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndTwoConditions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 2, conditions: 2 })
}

function _liveWithFourVersionsAndTwoConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 4, conditions: 2 })
}

function _expiringWithFourVersionsAndFourConditions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 4, conditions: 4 })
}

function _liveWithTwoPurposesAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { purposes: 2, conditions: 4 })
}

function _liveWithThreeConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { conditions: 3 })
}

function _liveWithTwoVersionsTwoPurposesAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 2, purposes: 2, conditions: 4 })
}

function _expiringWithThreeVersionsAndTwoConditions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 3, conditions: 2 })
}

function _liveWithThreeVersionsAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 3, conditions: 4 })
}

function _liveWithFourVersionsAndThreeConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 4, conditions: 3 })
}

function _liveWithThreeVersionsTwoPurposesAndFourConditions(region, startDate, purpose) {
  return _add(_build(region, startDate, purpose), region, { versions: 3, purposes: 2, conditions: 4 })
}

function _expiringWithTwoVersionsAndThreeConditions(region, startDate, purpose) {
  return _add(expireInFuture(_build(region, startDate, purpose)), region, { versions: 2, conditions: 3 })
}
