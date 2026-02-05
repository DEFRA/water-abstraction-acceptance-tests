import licence from '../fixture-builder/licence.js'
import licenceVersionPurposes from '../fixture-builder/licence-version-purposes.js'
import points from '../fixture-builder/points.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceTwoReturnRequirementsWithPoints () {
  return {
    ...licence(),
    ...points(2),
    ...licenceVersionPurposes(2),
    ...returnVersion(),
    ...returnRequirements(2),
    ...returnRequirementPoints(2)
  }
}
