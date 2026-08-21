import buildReturnVersionEntity from '../entities/return-version.entity.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'

export const title = 'Licence with two purposes and a return requirement'
export const description =
  'A licence with two points and two licence version purposes, and an existing return requirement and version'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const [licenceVersionPurpose] = licence.licenceVersionPurposes
  const [firstPoint] = licence.points

  const { returnVersion, returnRequirement, returnRequirementPurpose } = buildReturnVersionEntity(
    licence.licence,
    licenceVersionPurpose,
    firstPoint
  )

  const returnRequirementPoints = licence.points.map((point) => {
    return returnRequirementPointData(returnRequirement, point)
  })

  return {
    ...licence,
    returnVersion,
    returnRequirement,
    returnRequirementPoints,
    returnRequirementPurpose
  }
}
