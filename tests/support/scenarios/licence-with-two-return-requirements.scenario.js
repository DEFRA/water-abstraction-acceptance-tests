import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'

export const title = 'Licence with two return requirements'
export const description =
  'A licence with two points and two licence version purposes, and a return version with two return requirements, one per point and purpose'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const returnVersion = returnVersionData(licence.licence)

  const results = licence.licenceVersionPurposes.map((licenceVersionPurpose, index) => {
    const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
    const returnRequirementPoint = returnRequirementPointData(returnRequirement, licence.points[index])
    const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

    return { returnRequirement, returnRequirementPoint, returnRequirementPurpose }
  })

  return {
    ...licence,
    returnVersion,
    returnRequirements: results.map((result) => {
      return result.returnRequirement
    }),
    returnRequirementPoints: results.map((result) => {
      return result.returnRequirementPoint
    }),
    returnRequirementPurposes: results.map((result) => {
      return result.returnRequirementPurpose
    })
  }
}
