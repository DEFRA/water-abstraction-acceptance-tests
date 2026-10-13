import { currentPurpose } from './purposes.helpers.js'
import licenceVersionPurposePointData from '../../../../../../tests/support/data/licence-version-purpose-point.data.js'
import pointData from '../../../../../../tests/support/data/point.data.js'

/**
 * Add a point to a licence
 *
 * The point is linked to the first purpose on the licence's current licence version, so that purpose abstracts from
 * one more point.
 *
 * Call this again to add another.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 */
export function addPoint(licenceEntity, region) {
  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.points ??= [licenceEntity.point]
  licenceEntity.licenceVersionPurposePoints ??= [licenceEntity.licenceVersionPurposePoint]

  const point = pointData(region)

  point.description = `Example point ${licenceEntity.points.length + 1}`
  point.ngr1 = 'TT 9876 5432'

  licenceEntity.points.push(point)
  licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(currentPurpose(licenceEntity), point))
}

/**
 * Give a licence a number of points to abstract from
 *
 * Points are added until the licence has that many. A licence that already has that many, or more, is left alone.
 *
 * Each point added is linked to the first purpose on every licence version, so the licence has abstracted from it for
 * as long as it has been held.
 *
 * Call this after everything has been added to the licence.
 *
 * @param {object} licenceEntity - the licence entity to change
 * @param {object} region - the region the licence is in
 * @param {number} points - how many points the licence ends up with
 *
 * @returns {object} the same licence entity
 */
export function abstractFrom(licenceEntity, region, points) {
  // A licence is built with one of each. The first time this is called they are put into lists we can add to
  licenceEntity.points ??= [licenceEntity.point]
  licenceEntity.licenceVersionPurposePoints ??= [licenceEntity.licenceVersionPurposePoint]

  const licenceVersions = licenceEntity.licenceVersions ?? [licenceEntity.licenceVersion]
  const licenceVersionPurposes = licenceEntity.licenceVersionPurposes ?? [licenceEntity.licenceVersionPurpose]

  while (licenceEntity.points.length < points) {
    const point = pointData(region)

    point.description = `Example point ${licenceEntity.points.length + 1}`
    point.ngr1 = 'TT 9876 5432'

    licenceEntity.points.push(point)

    for (const licenceVersion of licenceVersions) {
      const firstPurpose = licenceVersionPurposes.find((licenceVersionPurpose) => {
        return licenceVersionPurpose.licenceVersionId === licenceVersion.id
      })

      licenceEntity.licenceVersionPurposePoints.push(licenceVersionPurposePointData(firstPurpose, point))
    }
  }

  return licenceEntity
}
