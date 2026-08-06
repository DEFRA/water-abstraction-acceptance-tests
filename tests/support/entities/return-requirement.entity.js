import returnRequirementData from '../data/return-requirement.data.js'
import returnRequirementPointData from '../data/return-requirement-point.data.js'
import returnRequirementPurposeData from '../data/return-requirement-purpose.data.js'
import returnVersionData from '../data/return-version.data.js'

/**
 * Builds a return requirement in its entirety: a return version, the return requirement itself, and its point and
 * purpose links — the minimum valid data a return requirement needs to exist against a licence.
 */
export default function (licence, licenceVersionPurpose, point) {
  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licenceVersionPurpose)
  const returnRequirementPoint = returnRequirementPointData(returnRequirement, point)
  const returnRequirementPurpose = returnRequirementPurposeData(returnRequirement, licenceVersionPurpose)

  return {
    returnVersion,
    returnRequirement,
    returnRequirementPoint,
    returnRequirementPurpose
  }
}
