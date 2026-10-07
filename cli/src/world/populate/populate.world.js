import { REGIONS } from './regions.populate.js'
import { addLicenceVersion } from './licence-versions.populate.js'
import buildLicenceEntity from '../../../../tests/support/entities/licence.entity.js'
import { mergeByKey } from '../../../../tests/support/helpers/scenario.helpers.js'
import { expire, expireInFuture, lapse, revoke } from './end-dates.populate.js'

/**
 * Generate the data that populates the world when it is created from the CLI, on top of what the specs ask for
 *
 * For each region its live and ended licences are built, then some of them are given more, for example more licence
 * versions. How many is set in `REGIONS`.
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateWorld() {
  const licenceEntities = []

  for (const regionData of REGIONS) {
    const { region } = regionData

    const live = _live(region, regionData.live)
    const ended = _ended(region, regionData.ended)

    _addLicenceVersions(live, region, regionData.live)
    _addLicenceVersions(ended, region, regionData.ended)

    licenceEntities.push(...live, ...ended)
  }

  return mergeByKey(...licenceEntities)
}

/**
 * Give some of the licences a second, third or fourth licence version
 *
 * @private
 */
function _addLicenceVersions(licenceEntities, region, counts) {
  const { twoVersions, threeVersions, fourVersions } = counts

  // Everything that gets more licence versions, then which of those get four, and which of the rest get three
  const all = _spread(licenceEntities, twoVersions + threeVersions + fourVersions, 0)
  const four = _spread(all, fourVersions, 0)
  const twoAndThree = all.filter((licenceEntity) => {
    return !four.includes(licenceEntity)
  })
  const three = _spread(twoAndThree, threeVersions, 0)

  for (const licenceEntity of all) {
    addLicenceVersion(licenceEntity, region)
  }

  for (const licenceEntity of [...three, ...four]) {
    addLicenceVersion(licenceEntity, region)
  }

  for (const licenceEntity of four) {
    addLicenceVersion(licenceEntity, region)
  }
}

/**
 * Build a region's licences that have ended: those that are revoked, expired or lapsed, and the combinations of them
 *
 * @private
 */
function _ended(region, ended) {
  const licenceEntities = []

  for (let i = 0; i < ended.revoked; i++) {
    licenceEntities.push(revoke(buildLicenceEntity(region)))
  }

  for (let i = 0; i < ended.expired; i++) {
    licenceEntities.push(expire(buildLicenceEntity(region)))
  }

  for (let i = 0; i < ended.lapsed; i++) {
    licenceEntities.push(lapse(buildLicenceEntity(region)))
  }

  for (let i = 0; i < ended.expiredAndRevoked; i++) {
    licenceEntities.push(revoke(expire(buildLicenceEntity(region))))
  }

  for (let i = 0; i < ended.revokedWithFutureExpiry; i++) {
    licenceEntities.push(revoke(expireInFuture(buildLicenceEntity(region))))
  }

  for (let i = 0; i < ended.expiredAndLapsed; i++) {
    licenceEntities.push(lapse(expire(buildLicenceEntity(region))))
  }

  for (let i = 0; i < ended.lapsedWithFutureExpiry; i++) {
    licenceEntities.push(lapse(expireInFuture(buildLicenceEntity(region))))
  }

  for (let i = 0; i < ended.lapsedAndRevoked; i++) {
    licenceEntities.push(revoke(lapse(buildLicenceEntity(region))))
  }

  for (let i = 0; i < ended.expiredLapsedAndRevoked; i++) {
    licenceEntities.push(revoke(lapse(expire(buildLicenceEntity(region)))))
  }

  return licenceEntities
}

/**
 * Build a region's licences that are live: those with no end date, and those that expire in the future
 *
 * @private
 */
function _live(region, live) {
  const licenceEntities = []

  for (let i = 0; i < live.none; i++) {
    licenceEntities.push(buildLicenceEntity(region))
  }

  for (let i = 0; i < live.expiresInFuture; i++) {
    licenceEntities.push(expireInFuture(buildLicenceEntity(region)))
  }

  return licenceEntities
}

/**
 * Pick `count` licences, evenly spaced through the list
 *
 * The lists are built one kind of licence after another, so picking evenly gives each kind its share. `start` is which
 * licence to begin at. Each thing we add uses a different one, so they do not all land on the same licences.
 *
 * @private
 */
function _spread(licenceEntities, count, start) {
  const spread = []

  for (let i = 0; i < count; i++) {
    const index = (start + Math.floor((i * licenceEntities.length) / count)) % licenceEntities.length

    spread.push(licenceEntities[index])
  }

  return spread
}
