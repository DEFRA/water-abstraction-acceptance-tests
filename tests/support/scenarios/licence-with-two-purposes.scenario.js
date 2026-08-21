import buildLicenceEntity from '../entities/licence.entity.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import pointData from '../data/point.data.js'
import { regionCode } from '../default-values.js'

export const title = 'Licence with two purposes'
export const description =
  'A licence with two points and two licence version purposes, and no existing return requirements'

export default function () {
  const licenceEntity = buildLicenceEntity()

  const secondPoint = pointData()

  secondPoint.description = 'Example point 2'
  secondPoint.ngr1 = 'TT 9876 5432'
  // The acceptance tests app's tear-down service only cleans up water.points for a hardcoded set of external_ids
  // (9000031, 9000032, 9000090, 9000091) rather than relying solely on its relational delete, so a genuinely new
  // external_id here would be left behind after every run and collide with itself on the next.
  secondPoint.externalId = `${regionCode}:9000090`

  const secondPurpose = licenceVersionPurposeData(licenceEntity.licenceVersion)

  secondPurpose.purposeId.value = '280'
  secondPurpose.externalId = `${regionCode}:9000092`

  const secondPurposePoint = licenceVersionPurposePointData(secondPurpose, secondPoint)

  return {
    ...licenceEntity,
    points: [licenceEntity.point, secondPoint],
    licenceVersionPurposes: [licenceEntity.licenceVersionPurpose, secondPurpose],
    licenceVersionPurposePoints: [licenceEntity.licenceVersionPurposePoint, secondPurposePoint]
  }
}
