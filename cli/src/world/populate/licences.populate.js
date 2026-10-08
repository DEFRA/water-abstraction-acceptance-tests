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
//
// Each licence version change has a reason: a transfer to a new licence holder, a correction, or a purpose being added.
// Purposes, points and conditions are added first, so that every licence version has them

function _revokedWithOneCondition(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  addCondition(licenceEntity)

  return licenceEntity
}

function _revokedWithTwoVersions(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  transfer(licenceEntity, region)

  return licenceEntity
}

function _expiredWithTwoPoints(region) {
  const licenceEntity = expire(buildLicenceEntity(region))

  addPoint(licenceEntity, region)

  return licenceEntity
}

function _expiredWithTwoVersionsAndOneCondition(region) {
  const licenceEntity = expire(buildLicenceEntity(region))

  addCondition(licenceEntity)

  transfer(licenceEntity, region)

  return licenceEntity
}

function _lapsedWithTwoPurposesAndTwoPoints(region) {
  const licenceEntity = lapse(buildLicenceEntity(region))

  addPurpose(licenceEntity, region)
  addPoint(licenceEntity, region)

  return licenceEntity
}

function _revokedWithTwoConditions(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _revokedWithTwoPurposes(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  addPurpose(licenceEntity, region)

  return licenceEntity
}

function _revokedWithTwoPurposesAndFourConditions(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  addPurpose(licenceEntity, region)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _revokedWithThreeVersions(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  transfer(licenceEntity, region)
  correct(licenceEntity, region)

  return licenceEntity
}

function _revokedWithThreeConditions(region) {
  const licenceEntity = revoke(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _liveWithTwoVersions(region) {
  const licenceEntity = buildLicenceEntity(region)

  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithOneCondition(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)

  return licenceEntity
}

function _expiringWithThreeVersions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  transfer(licenceEntity, region)
  correct(licenceEntity, region)

  return licenceEntity
}

function _liveWithFourVersions(region) {
  const licenceEntity = buildLicenceEntity(region)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  transfer(licenceEntity, region)

  return licenceEntity
}

function _expiringWithTwoVersionsAndOneCondition(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)

  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _expiringWithFourVersionsAndOneCondition(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithThreeVersionsAndOneCondition(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)

  return licenceEntity
}

function _expiringWithTwoConditions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _liveWithTwoVersionsAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithFourVersionsTwoPurposesAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  addPurposeToNewVersion(licenceEntity, region)

  return licenceEntity
}

function _expiringWithTwoVersionsAndTwoConditions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithFourVersionsAndTwoConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  transfer(licenceEntity, region)

  return licenceEntity
}

function _expiringWithFourVersionsAndFourConditions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithTwoPurposesAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addPurpose(licenceEntity, region)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _liveWithThreeConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  return licenceEntity
}

function _liveWithTwoVersionsTwoPurposesAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  addPurposeToNewVersion(licenceEntity, region)

  return licenceEntity
}

function _expiringWithThreeVersionsAndTwoConditions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)

  return licenceEntity
}

function _liveWithThreeVersionsAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)

  return licenceEntity
}

function _liveWithFourVersionsAndThreeConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  correct(licenceEntity, region)
  transfer(licenceEntity, region)

  return licenceEntity
}

function _liveWithThreeVersionsTwoPurposesAndFourConditions(region) {
  const licenceEntity = buildLicenceEntity(region)

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)
  addPurposeToNewVersion(licenceEntity, region)

  return licenceEntity
}

function _expiringWithTwoVersionsAndThreeConditions(region) {
  const licenceEntity = expireInFuture(buildLicenceEntity(region))

  addCondition(licenceEntity)
  addCondition(licenceEntity)
  addCondition(licenceEntity)

  transfer(licenceEntity, region)

  return licenceEntity
}
