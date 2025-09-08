import licence from '../fixture-builder/licence.js'
import points from '../fixture-builder/points.js'
import purposes from '../fixture-builder/purposes.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export default function basicLicenceOneReturnRequirementsWithTwoPoints () {
  const dataModel = {
    ...licence(),
    ...points(2),
    ...purposes(2),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnRequirementPoints(2)
  }

  dataModel.returnRequirementPoints[1].returnRequirementId = dataModel.returnRequirements[0].id

  return dataModel
}
