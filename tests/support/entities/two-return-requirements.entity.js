import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import licenceVersionPurposePointData from '../data/licence-version-purpose-point.data.js'
import pointData from '../data/point.data.js'
import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import { regionCode } from '../default-values.js'
import buildLicenceEntity from './licence.entity.js'
import buildReturnVersionEntity from './return-version.entity.js'

/**
 * Builds a licence with two return requirements, each tied to its own abstraction point and purpose — the minimum
 * valid data for scenarios that need more than one return requirement on a licence.
 */
export default function () {
  const licenceEntity = buildLicenceEntity()

  const secondPoint = pointData()
  secondPoint.description = 'Example point 2'
  secondPoint.ngr1 = 'TQ 1234 5679'
  // Reuses the same external_id licence-with-two-purposes.scenario.js already uses for its second point. The
  // acceptance tests app's tear-down service only cleans up water.points for a hardcoded set of external_ids
  // (9000031, 9000032, 9000090, 9000091) rather than relying solely on its relational delete, so a genuinely new
  // external_id here would be left behind after every run and collide with itself on the next.
  secondPoint.externalId = `${regionCode}:9000090`

  const secondLicenceVersionPurpose = licenceVersionPurposeData(licenceEntity.licenceVersion)
  secondLicenceVersionPurpose.purposeId.value = '420'
  secondLicenceVersionPurpose.externalId = `${regionCode}:9000092`
  const secondLicenceVersionPurposePoint = licenceVersionPurposePointData(secondLicenceVersionPurpose, secondPoint)

  const returnVersionEntity = buildReturnVersionEntity(
    licenceEntity.licence,
    licenceEntity.licenceVersionPurpose,
    licenceEntity.point
  )

  const secondReturnRequirement = returnRequirementData(returnVersionEntity.returnVersion, secondLicenceVersionPurpose)
  const secondReturnRequirementPoint = returnRequirementPointData(secondReturnRequirement, secondPoint)
  const secondReturnRequirementPurpose = returnRequirementPurposeData(
    secondReturnRequirement,
    secondLicenceVersionPurpose
  )

  return {
    ...licenceEntity,
    points: [licenceEntity.point, secondPoint],
    licenceVersionPurposes: [licenceEntity.licenceVersionPurpose, secondLicenceVersionPurpose],
    licenceVersionPurposePoints: [licenceEntity.licenceVersionPurposePoint, secondLicenceVersionPurposePoint],
    returnVersion: returnVersionEntity.returnVersion,
    returnRequirements: [returnVersionEntity.returnRequirement, secondReturnRequirement],
    returnRequirementPoints: [returnVersionEntity.returnRequirementPoint, secondReturnRequirementPoint],
    returnRequirementPurposes: [returnVersionEntity.returnRequirementPurpose, secondReturnRequirementPurpose]
  }
}
