import buildReturnVersionEntity from 'water-abstraction-engine/cli/world/entities/return-version.entity.js'
import { regions } from 'water-abstraction-engine/cli/world/default-values.js'
import returnRequirementPointData from 'water-abstraction-engine/cli/world/data/return-requirement-point.data.js'

import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with two purposes and a return requirement'
export const description =
  'A licence with two points and two licence version purposes, and an existing return requirement and version'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_WEST
  }

  const licence = licenceWithTwoPurposesScenario(region)

  const { returnVersion, returnRequirement, returnRequirementPurpose } = buildReturnVersionEntity(licence)

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
