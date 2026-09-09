import externalUserData from '../data/external-user.data.js'
import { regions } from '../default-values.js'
import registeredLicenceScenario from './registered-licence.scenario.js'

export const title = 'External sharing access'
export const description =
  'Licence with two external users: a primary user and a second user with shared (agent) access'

export default function (region = null) {
  if (!region) {
    region = regions.NORTH_EAST
  }

  const registeredLicence = registeredLicenceScenario(region)
  const sharingUser = externalUserData()

  return {
    ...registeredLicence,
    users: [registeredLicence.user, sharingUser]
  }
}
