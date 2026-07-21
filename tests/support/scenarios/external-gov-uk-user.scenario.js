import externalUserData from '../data/external-user.data.js'
import { yesterday } from '../helpers/date.helpers.js'

export const title = 'External gov.uk user only'
export const description = 'A single external user with a gov.uk address and no associated licence or return data'

export default function () {
  const externalUser = externalUserData()

  externalUser.users[0].username = `regression.tests.${Date.now()}@defra.gov.uk`
  externalUser.users[0].lastLogin = yesterday()

  return {
    ...externalUser
  }
}
