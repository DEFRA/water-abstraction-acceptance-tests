import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with two purposes and a return requirement'
export const description =
  'A licence with two points and two licence version purposes, and an existing return requirement and version'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const returnVersion = returnVersionData(licence.licence)

  const [licenceVersionPurpose] = licence.licenceVersionPurposes

  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoints = licence.points.map((point) => {
    return returnRequirementPointData(returnRequirement, point)
  })
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return {
    ...licence,
    returnVersion,
    returnRequirement,
    returnRequirementPoints,
    returnRequirementPurpose
  }
}
