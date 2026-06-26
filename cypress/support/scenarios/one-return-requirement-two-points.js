import licence from '../fixture-builder/licence.js'
import licenceVersionPurposes from '../fixture-builder/licence-version-purposes.js'
import points from '../fixture-builder/points.js'
import returnRequirements from '../fixture-builder/return-requirements.js'
import returnRequirementPoints from '../fixture-builder/return-requirement-points.js'
import returnVersion from '../fixture-builder/return-version.js'

export const title = 'One return requirement with two points'
export const description = 'Licence with one return requirement linked to two abstraction points, with no return logs'

export default function () {
  const dataModel = {
    ...licence(),
    ...points(2),
    ...licenceVersionPurposes(2),
    ...returnVersion(),
    ...returnRequirements(),
    ...returnRequirementPoints(2)
  }

  dataModel.returnRequirementPoints[1].returnRequirementId = dataModel.returnRequirements[0].id

  return dataModel
}
