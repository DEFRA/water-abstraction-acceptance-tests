import registeredLicenceScenario from './registered-licence.scenario.js'
import userData from '../data/user.data.js'
import { applications, regions } from '../default-values.js'

export const title = 'External sharing access'
export const description =
  'Licence with two external users: a primary user and a second user with shared (agent) access'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_EAST
  }

  const registeredLicence = registeredLicenceScenario(region)
  const user = userData(applications.EXTERNAL)

  return {
    ...registeredLicence,
    users: [...registeredLicence.users, user]
  }
}
