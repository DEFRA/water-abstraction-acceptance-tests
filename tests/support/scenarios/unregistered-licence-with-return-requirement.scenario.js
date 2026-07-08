import returnRequirementData from '../data/return-requirement.data.js'
import returnVersionData from '../data/return-version.data.js'
import unregisteredLicenceScenario from './unregistered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Unregistered licence with a return requirement'
export const description = 'A licence with a single return requirement and version, but no return logs'

export default function (licenceRef = 'AT/TE/ST/01/01') {
  const licence = unregisteredLicenceScenario(licenceRef)

  const returnVersion = returnVersionData(licence)
  const returnRequirement = returnRequirementData(returnVersion, licence)

  return mergeByKey(licence, returnVersion, returnRequirement)
}
