import { regions } from '../../../../tests/support/default-values.js'

/**
 * How many licences to add for each region
 *
 * A region's live and ended licences are counted separately, as they differ in everything else we add to them. In each
 * section the first numbers are how many licences of each kind to build. The rest are how many of those licences get
 * something more, for example how many have two licence versions.
 *
 * Out of every 1,000 licences added the spread across the regions is: Anglian 274, Midlands 216, South West 158,
 * North East 126, North West 84, Thames 67, Southern 46 and Wales 29
 */
export const REGIONS = [
  {
    region: regions.ANGLIAN,
    live: {
      none: 39,
      expiresInFuture: 26,
      twoVersions: 16,
      threeVersions: 11,
      fourVersions: 17
    },
    ended: {
      revoked: 154,
      expired: 51,
      lapsed: 6,
      expiredAndRevoked: 13,
      revokedWithFutureExpiry: 2,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 1,
      expiredLapsedAndRevoked: 1,
      twoVersions: 27,
      threeVersions: 11,
      fourVersions: 8
    }
  },
  {
    region: regions.MIDLANDS,
    live: {
      none: 35,
      expiresInFuture: 12,
      twoVersions: 12,
      threeVersions: 9,
      fourVersions: 11
    },
    ended: {
      revoked: 122,
      expired: 19,
      lapsed: 32,
      expiredAndRevoked: 8,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 1,
      expiredLapsedAndRevoked: 0,
      twoVersions: 24,
      threeVersions: 6,
      fourVersions: 4
    }
  },
  {
    region: regions.SOUTH_WEST,
    live: {
      none: 22,
      expiresInFuture: 7,
      twoVersions: 8,
      threeVersions: 6,
      fourVersions: 6
    },
    ended: {
      revoked: 120,
      expired: 7,
      lapsed: 8,
      expiredAndRevoked: 3,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 0,
      expiredLapsedAndRevoked: 0,
      twoVersions: 17,
      threeVersions: 6,
      fourVersions: 3
    }
  },
  {
    region: regions.NORTH_EAST,
    live: {
      none: 16,
      expiresInFuture: 15,
      twoVersions: 8,
      threeVersions: 5,
      fourVersions: 5
    },
    ended: {
      revoked: 63,
      expired: 26,
      lapsed: 8,
      expiredAndRevoked: 4,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 1,
      expiredLapsedAndRevoked: 0,
      twoVersions: 14,
      threeVersions: 5,
      fourVersions: 3
    }
  },
  {
    region: regions.NORTH_WEST,
    live: {
      none: 15,
      expiresInFuture: 7,
      twoVersions: 6,
      threeVersions: 4,
      fourVersions: 5
    },
    ended: {
      revoked: 48,
      expired: 9,
      lapsed: 4,
      expiredAndRevoked: 3,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 1,
      expiredLapsedAndRevoked: 0,
      twoVersions: 10,
      threeVersions: 3,
      fourVersions: 2
    }
  },
  {
    region: regions.THAMES,
    live: {
      none: 14,
      expiresInFuture: 10,
      twoVersions: 6,
      threeVersions: 3,
      fourVersions: 4
    },
    ended: {
      revoked: 23,
      expired: 17,
      lapsed: 2,
      expiredAndRevoked: 3,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 0,
      expiredLapsedAndRevoked: 0,
      twoVersions: 10,
      threeVersions: 3,
      fourVersions: 3
    }
  },
  {
    region: regions.SOUTHERN,
    live: {
      none: 18,
      expiresInFuture: 6,
      twoVersions: 4,
      threeVersions: 5,
      fourVersions: 11
    },
    ended: {
      revoked: 17,
      expired: 4,
      lapsed: 1,
      expiredAndRevoked: 1,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 0,
      expiredLapsedAndRevoked: 0,
      twoVersions: 6,
      threeVersions: 3,
      fourVersions: 3
    }
  },
  {
    region: regions.WALES,
    live: {
      none: 4,
      expiresInFuture: 2,
      twoVersions: 2,
      threeVersions: 1,
      fourVersions: 2
    },
    ended: {
      revoked: 18,
      expired: 2,
      lapsed: 1,
      expiredAndRevoked: 1,
      revokedWithFutureExpiry: 1,
      expiredAndLapsed: 1,
      lapsedWithFutureExpiry: 1,
      lapsedAndRevoked: 0,
      expiredLapsedAndRevoked: 0,
      twoVersions: 5,
      threeVersions: 2,
      fourVersions: 1
    }
  }
]
