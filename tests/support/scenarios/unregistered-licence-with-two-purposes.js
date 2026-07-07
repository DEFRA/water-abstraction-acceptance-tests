import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import pointData from '../data/point.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Two return requirements with points'
export const description =
  'A licence with two points and two licence version purposes, and an existing return version and requirement'

export default function (licenceRef = 'AT/TE/ST/01/01') {
  const licence = unregisteredLicenceScenario(licenceRef)

  const [point] = licence.points

  point.description = 'Example point 1'
  point.ngr1 = 'TQ 1234 5678'
  point.externalId = '9:9000090'

  const secondPoint = pointData('Example point 2', 'TT 9876 5432')
  const secondPurpose = licenceVersionPurposeData(licence, secondPoint, {
    purposeLegacyId: '280',
    externalId: '6:1235'
  })

  // Simpler to push straight onto licence.points than pull in mergeByKey just for this one array
  licence.points.push(...secondPoint.points)

  return mergeByKey(licence, secondPurpose)
}
