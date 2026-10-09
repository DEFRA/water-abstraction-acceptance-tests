import licenceVersionPurposePointData from '../../../../../../tests/support/data/licence-version-purpose-point.data.js'
import pointData from '../../../../../../tests/support/data/point.data.js'
import { currentPurpose } from './purposes.helpers.js'

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
