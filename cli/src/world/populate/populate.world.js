import buildLicenceEntity from '../../../../tests/support/entities/licence.entity.js'
import { mergeByKey } from '../../../../tests/support/helpers/scenario.helpers.js'
import { regions } from '../../../../tests/support/default-values.js'
import { expire, expireInFuture, lapse, revoke } from './end-dates.populate.js'

/**
 * How many licences to add for each region, by how the licence has ended
 *
 * Out of every 1,000 licences added the spread across the regions is: Anglian 274, Midlands 216, South West 158,
 * North East 126, North West 84, Thames 67, Southern 46 and Wales 29
 */
const REGIONS = [
  {
    region: regions.ANGLIAN,
    none: 39,
    revoked: 154,
    expired: 51,
    expiresInFuture: 26,
    lapsed: 6,
    expiredAndRevoked: 13,
    revokedWithFutureExpiry: 2,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 1,
    expiredLapsedAndRevoked: 1
  },
  {
    region: regions.MIDLANDS,
    none: 35,
    revoked: 122,
    expired: 19,
    expiresInFuture: 12,
    lapsed: 32,
    expiredAndRevoked: 8,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 1,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.SOUTH_WEST,
    none: 22,
    revoked: 120,
    expired: 7,
    expiresInFuture: 7,
    lapsed: 8,
    expiredAndRevoked: 3,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 0,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.NORTH_EAST,
    none: 16,
    revoked: 63,
    expired: 26,
    expiresInFuture: 15,
    lapsed: 8,
    expiredAndRevoked: 4,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 1,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.NORTH_WEST,
    none: 15,
    revoked: 48,
    expired: 9,
    expiresInFuture: 7,
    lapsed: 4,
    expiredAndRevoked: 3,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 1,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.THAMES,
    none: 14,
    revoked: 23,
    expired: 17,
    expiresInFuture: 10,
    lapsed: 2,
    expiredAndRevoked: 3,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 0,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.SOUTHERN,
    none: 18,
    revoked: 17,
    expired: 4,
    expiresInFuture: 6,
    lapsed: 1,
    expiredAndRevoked: 1,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 0,
    expiredLapsedAndRevoked: 0
  },
  {
    region: regions.WALES,
    none: 4,
    revoked: 18,
    expired: 2,
    expiresInFuture: 2,
    lapsed: 1,
    expiredAndRevoked: 1,
    revokedWithFutureExpiry: 1,
    expiredAndLapsed: 1,
    lapsedWithFutureExpiry: 1,
    lapsedAndRevoked: 0,
    expiredLapsedAndRevoked: 0
  }
]

/**
 * Generate the data that populates the world when it is created from the CLI, on top of what the specs ask for
 *
 * @returns {object} the data, keyed by database table name
 */
export default function populateWorld() {
  const licenceEntities = []

  for (const counts of REGIONS) {
    const { region } = counts

    for (let i = 0; i < counts.none; i++) {
      licenceEntities.push(buildLicenceEntity(region))
    }

    for (let i = 0; i < counts.revoked; i++) {
      licenceEntities.push(revoke(buildLicenceEntity(region)))
    }

    for (let i = 0; i < counts.expired; i++) {
      licenceEntities.push(expire(buildLicenceEntity(region)))
    }

    for (let i = 0; i < counts.expiresInFuture; i++) {
      licenceEntities.push(expireInFuture(buildLicenceEntity(region)))
    }

    for (let i = 0; i < counts.lapsed; i++) {
      licenceEntities.push(lapse(buildLicenceEntity(region)))
    }

    for (let i = 0; i < counts.expiredAndRevoked; i++) {
      licenceEntities.push(revoke(expire(buildLicenceEntity(region))))
    }

    for (let i = 0; i < counts.revokedWithFutureExpiry; i++) {
      licenceEntities.push(revoke(expireInFuture(buildLicenceEntity(region))))
    }

    for (let i = 0; i < counts.expiredAndLapsed; i++) {
      licenceEntities.push(lapse(expire(buildLicenceEntity(region))))
    }

    for (let i = 0; i < counts.lapsedWithFutureExpiry; i++) {
      licenceEntities.push(lapse(expireInFuture(buildLicenceEntity(region))))
    }

    for (let i = 0; i < counts.lapsedAndRevoked; i++) {
      licenceEntities.push(revoke(lapse(buildLicenceEntity(region))))
    }

    for (let i = 0; i < counts.expiredLapsedAndRevoked; i++) {
      licenceEntities.push(revoke(lapse(expire(buildLicenceEntity(region)))))
    }
  }

  return mergeByKey(...licenceEntities)
}
