import { generateLicenceVersionPurposeExternalId } from 'water-abstraction-engine/test/generators.js'

import buildLicenceEntity from '../entities/licence.entity.js'
import { generatePointExternalId } from '../helpers/generators.helpers.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import pointData from '../data/point.data.js'

export const title = 'Licence with two purposes'
export const description =
  'A licence with two points and two licence version purposes, and no existing return requirements'

export default function () {
  const licenceEntity = buildLicenceEntity()

  const secondPoint = pointData()

  secondPoint.description = 'Example point 2'
  secondPoint.ngr1 = 'TT 9876 5432'
  secondPoint.externalId = generatePointExternalId()

  const secondPurpose = licenceVersionPurposeData(licenceEntity.licenceVersion)

  secondPurpose.purposeId.value = '280'
  secondPurpose.externalId = generateLicenceVersionPurposeExternalId()

  const secondPurposePoint = licenceVersionPurposePointData(secondPurpose, secondPoint)

  return {
    ...licenceEntity,
    points: [licenceEntity.point, secondPoint],
    licenceVersionPurposes: [licenceEntity.licenceVersionPurpose, secondPurpose],
    licenceVersionPurposePoints: [licenceEntity.licenceVersionPurposePoint, secondPurposePoint]
  }
}
