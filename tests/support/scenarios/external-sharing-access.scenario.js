import externalUserData from '../data/external-user.data.js'
import registeredLicenceScenario from './registered-licence.scenario.js'

export const title = 'External sharing access'
export const description =
  'Licence with two external users: a primary user and a second user with shared (agent) access'

export default function () {
  const registeredLicence = registeredLicenceScenario()
  const sharingUser = externalUserData()

  return {
    ...registeredLicence,
    users: [registeredLicence.user, sharingUser]
  }
}
