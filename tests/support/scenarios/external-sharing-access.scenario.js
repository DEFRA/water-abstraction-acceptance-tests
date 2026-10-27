import userData from 'water-abstraction-engine/cli/world/data/user.data.js'
import { applications, regions } from 'water-abstraction-engine/cli/world/default-values.js'

import registeredLicenceScenario from './registered-licence.scenario.js'

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
