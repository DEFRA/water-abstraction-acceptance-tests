import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import pointData from '../data/point.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regionCode } from '../default-values.js'

export const title = 'Unregistered licence with two purposes'
export const description =
  'A licence with two points and two licence version purposes, and no existing return requirements'

export default function () {
  const licence = unregisteredLicenceScenario()

  const secondPoint = pointData('Example point 2', 'TT 9876 5432')

  secondPoint.points[0].description = 'Example point 2'
  secondPoint.points[0].ngr1 = 'TT 9876 5432'
  secondPoint.points[0].externalId = `${regionCode}:9000092`

  const secondPurpose = licenceVersionPurposeData(licence, secondPoint)

  secondPurpose.licenceVersionPurposes[0].purposeId.value = '280'
  secondPurpose.licenceVersionPurposes[0].externalId = `${regionCode}:9000092`

  // Simpler to push straight onto licence.points than pull in mergeByKey just for this one array
  licence.points.push(...secondPoint.points)

  return mergeByKey(licence, secondPurpose)
}
