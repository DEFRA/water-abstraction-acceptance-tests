import chargeElementData from '../data/charge-element.data.js'
import licenceVersionPurposeData from '../data/licence-version-purpose.data.js'
import pointData from '../data/point.data.js'
import licenceWithChargeVersionScenario from './licence-with-charge-version.scenario.js'
import { convertCubicMetresToMegalitres } from '../helpers/conversion.helpers.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'
import { regionCode } from '../default-values.js'

export const title = 'Licence with a charge version and two purposes'
export const description =
  'Licence with one charge version, one reference, two points, two licence version purposes, and two elements based on the licence data'

export default function () {
  const licence = licenceWithChargeVersionScenario()

  const secondPoint = pointData('Example point 2', 'TT 9876 5432')

  secondPoint.points[0].description = 'Example point 2'
  secondPoint.points[0].ngr1 = 'TT 9876 5432'
  secondPoint.points[0].externalId = `${regionCode}:9000092`

  const secondPurpose = licenceVersionPurposeData(licence, secondPoint)

  secondPurpose.licenceVersionPurposes[0].purposeId.value = '280'
  secondPurpose.licenceVersionPurposes[0].externalId = `${regionCode}:9000092`

  // Simpler to push straight onto licence.points than pull in mergeByKey just for this one array
  licence.points.push(...secondPoint.points)

  const secondChargeElement = chargeElementData(licence, secondPurpose)

  // The charge reference (built as part of licenceWithChargeVersionScenario()) only accounts for the first purpose's
  // annual quantity. As it now covers both purposes' charge elements, we correct its volume to the combined total.
  const {
    licenceVersionPurposes: [firstLicenceVersionPurpose]
  } = licence
  const totalAnnualQuantity =
    firstLicenceVersionPurpose.annualQuantity + secondPurpose.licenceVersionPurposes[0].annualQuantity

  licence.chargeReferences[0].volume = convertCubicMetresToMegalitres(totalAnnualQuantity)

  return mergeByKey(licence, secondPurpose, secondChargeElement)
}
