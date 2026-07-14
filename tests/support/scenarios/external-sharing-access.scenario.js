import externalUserData from '../data/external-user.data.js'
import registeredLicenceScenario from './registered-licence.scenario.js'
import { mergeByKey } from '../helpers/scenario.helpers.js'

export const title = 'Sharing access'
export const description =
  'Licence with two external users: a primary user and a second user with shared (agent) access'

export default function () {
  const registeredLicence = registeredLicenceScenario()
  const sharingUser = externalUserData()

  sharingUser.users[0].username = 'external.shared@example.com'

  return mergeByKey(registeredLicence, sharingUser)
}
