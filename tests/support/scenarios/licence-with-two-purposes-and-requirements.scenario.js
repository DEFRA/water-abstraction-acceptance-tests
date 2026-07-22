import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import licenceWithTwoPurposesScenario from './licence-with-two-purposes.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Licence with two purposes and a return requirement'
export const description =
  'A licence with two points and two licence version purposes, and an existing return requirement and version'

export default function () {
  const licence = licenceWithTwoPurposesScenario()

  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)

  return mergeByKey(licence, returnVersion, returnRequirement)
}
